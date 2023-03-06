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
            await _context.Basins.AddAsync(basin);
            int added = await _context.SaveChangesAsync();
            if (added > 0)
            {
                return Ok(basin);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
