using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

using AtlasDeviceManager;
using AtlasDeviceManager.Configuration;
using AtlasDeviceManager.Data.Contexts;
using AtlasDeviceManager.Data.Extensions;
using AtlasDeviceManager.Extensions;
using AtlasDeviceManager.Models;


var config = Config.LoadConfig(args, Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));
if (config.Providers.Count() == 2)
{
    // Only environment variables and command line providers added,
    // failed to load config provider.
    Environment.FailFast($"Failed to find or load configuration file, exiting...");
}

var logger = new Logger<Program>(LoggerFactory.Create(x => x.AddConsole()));
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseConfiguration(config);

// Add services to the container.
#region Database
var rdmConnectionString = builder.Configuration.GetConnectionString("RdmConnection") ?? throw new InvalidOperationException("Connection string 'RdmConnection' not found.");
builder.Services.AddDbContext<RdmDbContext>(options =>
    options.UseMySql(rdmConnectionString, ServerVersion.AutoDetect(rdmConnectionString)));

var atlasConnectionString = builder.Configuration.GetConnectionString("AtlasConnection") ?? throw new InvalidOperationException("Connection string 'AtlasConnection' not found.");
builder.Services.AddDbContext<UserIdentityDbContext>(options =>
    options.UseMySql(atlasConnectionString, ServerVersion.AutoDetect(atlasConnectionString)));
#endregion

#region Authentication
//builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
//    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Lockout = new LockoutOptions
    {
        AllowedForNewUsers = true,
        MaxFailedAccessAttempts = 5,
        DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15),
    };
    options.Password = new PasswordOptions
    {
        RequireDigit = true,
        RequiredLength = 8,
        RequiredUniqueChars = 1,
        RequireLowercase = true,
        RequireUppercase = true,
        RequireNonAlphanumeric = true,
    };
    options.SignIn = new SignInOptions
    {
        RequireConfirmedAccount = true,
        RequireConfirmedEmail = true,
        //RequireConfirmedPhoneNumber = true,
    };
    //options.User.RequireUniqueEmail = true;
    //options.Stores.ProtectPersonalData = true;
    //options.ClaimsIdentity.EmailClaimType;
})
    .AddDefaultUI()
    .AddEntityFrameworkStores<UserIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, UserIdentityDbContext>();

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();
#endregion

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = Strings.AssemblyName, Version = "v" + Strings.AssemblyVersion });
    });
}

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
ConfigureVersioning(builder.Services);


var app = builder.Build();

// Seed default user and roles
await SeedDefaultDataAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("v1/swagger.json", $"{Strings.AssemblyName} v{Strings.AssemblyVersion}");
    });
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors(options => options
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials()
);

app.UseHttpsRedirection();

// Cache static asset files (i.e. images, fonts, json files, etc)
var cachePeriod = app.Environment.IsDevelopment() ? 600 : 604800;
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}");
    }
});
app.UseRouting();

#region Authentication
app.UseAuthentication();
app.UseIdentityServer();
app.UseCookiePolicy(new CookiePolicyOptions
{
    // Determine whether user consent for non-essential 
    // cookies is needed for a given request
    CheckConsentNeeded = context => true,
    // https://stackoverflow.com/a/64874175
    MinimumSameSitePolicy = SameSiteMode.Lax,
});
app.UseAuthorization();
#endregion

app.MapControllerRoute(
    name: "default",
    pattern: "/{controller}/{action=Index}/{id?}"
);
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();


void ConfigureVersioning(IServiceCollection services)
{
    services.AddControllersWithViews();// options => options.UseGeneralRoutePrefix("/v{version:apiVersion}"));

    services.AddApiVersioning(options =>
    {
        options.AssumeDefaultVersionWhenUnspecified = false;
        options.DefaultApiVersion = new ApiVersion(1, 0);
        options.ReportApiVersions = true;
    });

    services.AddVersionedApiExplorer(options =>
    {
        // Add the versioned API explorer, which also adds the IApiVersionDescriptionProvider service
        // NOTE: The specified format code will format the version as "'v'major[.minor][-status]"
        options.GroupNameFormat = "'v'VVV";
        // NOTE: This option is only necessary when versioning by url segment. The SubstitutionFormat
        // can also be used to control the format of the API version in route templates
        options.SubstituteApiVersionInUrl = true;
    });
}


async Task SeedDefaultDataAsync(IServiceProvider serviceProvider)
{
    using (var scope = serviceProvider.CreateScope())
    {
        var services = scope.ServiceProvider;
        var loggerFactory = services.GetRequiredService<ILoggerFactory>();
        try
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            // Migrate database to latest migration automatically if enabled
            //if (config.GetValue<bool>("AutomaticMigrations"))
            {
                // Migrate the UserIdentity tables
                await serviceProvider.MigrateDatabaseAsync<UserIdentityDbContext>();

                // Migrate the device controller tables
                await serviceProvider.MigrateDatabaseAsync<RdmDbContext>();
            }

            // TODO: Add database meta or something to determine if default entities have been seeded

            // Seed default user roles
            await UserIdentityContextSeed.SeedRolesAsync(roleManager);

            // Seed default SuperAdmin user
            await UserIdentityContextSeed.SeedSuperAdminAsync(userManager);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}