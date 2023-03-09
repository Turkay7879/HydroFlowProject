using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HydroFlowProject.Data;
using HydroFlowProject.Models;
using System.Collections;
using NuGet.Protocol;

namespace HydroFlowProject.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class BasinsController : Controller
    {
        private readonly SqlServerDbContext _context;

        public BasinsController(SqlServerDbContext context)
        {
            _context = context;
        }

        // GET: Basins
        [HttpGet]
        [Route("getAllBasins")]
        public string GetAllBasins()
        {
              return _context.Basins != null 
                ? _context.Basins.ToJson()
                : "";
        }

        // POST: Save new basin
        [HttpPost]
        [Route("saveBasin")]
        public async Task<ActionResult<Basin>> SaveBasin([FromBody] Basin basin)
        {
            var toUpdate = await _context.Basins.FindAsync(basin.Id);
            if (toUpdate == null)
            {
                await _context.Basins.AddAsync(basin);
            } else
            {
                _context.Basins.Entry(toUpdate).CurrentValues.SetValues(basin);
            }
            
            int added = await _context.SaveChangesAsync();
            if (added > 0 || toUpdate != null)
            {
                return Ok(basin);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        // DELETE: Delete a basin
        [HttpDelete]
        [Route("deleteBasin")]
        public async Task<ActionResult<Basin>> DeleteBasin([FromBody] Basin basin)
        {
            _context.Basins.Remove(basin);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(basin);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
