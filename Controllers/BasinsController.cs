using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HydroFlowProject.Data;
using HydroFlowProject.Models;

namespace HydroFlowProject.Controllers
{
    public class BasinsController : Controller
    {
        private readonly SqlServerDbContext _context;

        public BasinsController(SqlServerDbContext context)
        {
            _context = context;
        }

        // GET: Basins
        public async Task<IActionResult> Index()
        {
              return _context.Basins != null ? 
                          View(await _context.Basins.ToListAsync()) :
                          Problem("Entity set 'SqlServerDbContext.Basins'  is null.");
        }

        // GET: Basins/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Basins == null)
            {
                return NotFound();
            }

            var basin = await _context.Basins
                .FirstOrDefaultAsync(m => m.Id == id);
            if (basin == null)
            {
                return NotFound();
            }

            return View(basin);
        }

        // GET: Basins/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Basins/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,BasinName,FlowStationNo,FlowObservationStationLat,FlowObservationStationLong,Field,Description")] Basin basin)
        {
            if (ModelState.IsValid)
            {
                _context.Add(basin);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(basin);
        }

        // GET: Basins/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Basins == null)
            {
                return NotFound();
            }

            var basin = await _context.Basins.FindAsync(id);
            if (basin == null)
            {
                return NotFound();
            }
            return View(basin);
        }

        // POST: Basins/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,BasinName,FlowStationNo,FlowObservationStationLat,FlowObservationStationLong,Field,Description")] Basin basin)
        {
            if (id != basin.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(basin);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BasinExists(basin.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(basin);
        }

        // GET: Basins/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Basins == null)
            {
                return NotFound();
            }

            var basin = await _context.Basins
                .FirstOrDefaultAsync(m => m.Id == id);
            if (basin == null)
            {
                return NotFound();
            }

            return View(basin);
        }

        // POST: Basins/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Basins == null)
            {
                return Problem("Entity set 'SqlServerDbContext.Basins'  is null.");
            }
            var basin = await _context.Basins.FindAsync(id);
            if (basin != null)
            {
                _context.Basins.Remove(basin);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool BasinExists(int id)
        {
          return (_context.Basins?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
