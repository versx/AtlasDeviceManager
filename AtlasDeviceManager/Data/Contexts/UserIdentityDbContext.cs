namespace AtlasDeviceManager.Data.Contexts;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using AtlasDeviceManager.Areas.Identity.Models;

public class UserIdentityDbContext : IdentityDbContext
{
    public DbSet<ApplicationUser> ApplicationUser { get; set; } = default!;

    public UserIdentityDbContext(DbContextOptions<UserIdentityDbContext> options)
        : base(options)
    {
    }
}