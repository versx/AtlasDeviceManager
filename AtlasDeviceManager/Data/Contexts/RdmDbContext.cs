namespace AtlasDeviceManager.Data.Contexts;

using Microsoft.EntityFrameworkCore;

using AtlasDeviceManager.Data.Entities;

public class RdmDbContext : DbContext
{
    public DbSet<Device> Devices { get; set; } = default!;

    public RdmDbContext(DbContextOptions<RdmDbContext> options)
        : base(options)
    {
    }
}