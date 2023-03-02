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
    public class BasinsController : Controller
    {
        private readonly SqlServerDbContext _context;

        public BasinsController(SqlServerDbContext context)
        {
            _context = context;
        }

        // GET: Basins
        [HttpGet]
        [Route("[controller]/getAllBasins")]
        public string GetAllBasins()
        {
              return _context.Basins != null 
                ? _context.Basins.ToJson()
                : "{\"ErrorMessage\": \"No Basin Found\"}";
        }
    }
}
