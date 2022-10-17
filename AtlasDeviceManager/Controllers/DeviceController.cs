namespace AtlasDeviceManager.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using AtlasDeviceManager.Data.Contexts;
using AtlasDeviceManager.Data.Entities;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class DeviceController : ControllerBase
{
    private readonly ILogger<DeviceController> _logger;
    private readonly RdmDbContext _context;

    public DeviceController(
        ILogger<DeviceController> logger,
        RdmDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public IEnumerable<Device> Get()
    {
        var devices = _context.Devices.ToList();
        return devices;
    }

    [HttpGet("{uuid}")]
    public async Task<Device> Get(string uuid)
    {
        var device = await _context.Devices.FindAsync(uuid);
        return device;
    }
}