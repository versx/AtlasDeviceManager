using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using AtlasDeviceManager.Areas.Identity.Models;
using AtlasDeviceManager.Configuration;
using AtlasDeviceManager.Data.Contexts;
using AtlasDeviceManager.Extensions;


var logger = new Logger<Program>(LoggerFactory.Create(x => x.AddConsole()));
var config = Config.LoadConfig(args, Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));
if (config.Providers.Count() == 2)
{
    // Only environment variables and command line providers added,
    // failed to load config provider.
    Environment.FailFast($"Failed to find or load configuration file, exiting...");
}

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseConfiguration(config);

// Add services to the container.
var atlasConnectionString = builder.Configuration.GetConnectionString("AtlasConnection") ?? throw new InvalidOperationException("Connection string 'AtlasConnection' not found.");
var rdmConnectionString = builder.Configuration.GetConnectionString("RdmConnection") ?? throw new InvalidOperationException("Connection string 'RdmConnection' not found.");

builder.Services.AddDbContext<RdmDbContext>(options =>
    options.UseMySql(rdmConnectionString, ServerVersion.AutoDetect(rdmConnectionString)));
builder.Services.AddDbContext<UserIdentityDbContext>(options =>
    options.UseMySql(atlasConnectionString, ServerVersion.AutoDetect(atlasConnectionString)));

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

builder.Services
    .AddAuthorization()
    .AddAuthentication()
    .AddCookie(options =>
    {
        // Cookie settings
        options.Cookie.HttpOnly = true;
        //options.Cookie.Expiration 
        options.ExpireTimeSpan = TimeSpan.FromHours(1);
        options.LoginPath = "/Identity/Account/Login";
        options.LogoutPath = "/Identity/Account/Logout";
        options.AccessDeniedPath = "/Identity/Account/AccessDenied";
        options.SlidingExpiration = true;
        //options.ReturnUrlParameter = "";

    });
    //.AddOpenAuthProviders(builder.Configuration);

builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddControllersWithViews();


var app = builder.Build();

// Seed default user and roles
await SeedDefaultDataAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseCookiePolicy(new CookiePolicyOptions
{
    // Determine whether user consent for non-essential 
    // cookies is needed for a given request
    CheckConsentNeeded = context => true,
    // https://stackoverflow.com/a/64874175
    MinimumSameSitePolicy = SameSiteMode.Lax,
});
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();


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