namespace AtlasDeviceManager.Data.Contexts;

using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using AtlasDeviceManager.Models;

public class UserIdentityDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public DbSet<ApplicationUser> ApplicationUsers { get; set; } = default!;

    public UserIdentityDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options, operationalStoreOptions)
    {
    }
}