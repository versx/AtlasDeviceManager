namespace AtlasDeviceManager.Controllers;

using System.Linq;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using AtlasDeviceManager.Data.Contexts;

public class DeviceController : Controller
{
    private readonly RdmDbContext _context;

    public DeviceController(RdmDbContext context)
    {
        _context = context;
    }

    // GET: Device
    public ActionResult Index()
    {
        var devices = _context.Devices.ToList();
        return View(devices);
    }

    // GET: Device/Details/5
    public ActionResult Details(int id)
    {
        return View();
    }

    // GET: Device/Create
    public ActionResult Create()
    {
        return View();
    }

    // POST: Device/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Create(IFormCollection collection)
    {
        try
        {
            // TODO: Add insert logic here

            return RedirectToAction(nameof(Index));
        }
        catch
        {
            return View();
        }
    }

    // GET: Device/Edit/5
    public ActionResult Edit(int id)
    {
        return View();
    }

    // POST: Device/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Edit(int id, IFormCollection collection)
    {
        try
        {
            // TODO: Add update logic here

            return RedirectToAction(nameof(Index));
        }
        catch
        {
            return View();
        }
    }

    // GET: Device/Delete/5
    public ActionResult Delete(int id)
    {
        return View();
    }

    // POST: Device/Delete/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Delete(int id, IFormCollection collection)
    {
        try
        {
            // TODO: Add delete logic here

            return RedirectToAction(nameof(Index));
        }
        catch
        {
            return View();
        }
    }
}