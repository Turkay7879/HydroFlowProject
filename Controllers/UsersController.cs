using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HydroFlowProject.Data;
using HydroFlowProject.Models;
using NuGet.Protocol;

namespace HydroFlowProject.Controllers
{
    [ApiController]
    public class UsersController : Controller
    {
        private readonly SqlServerDbContext _context;

        public UsersController(SqlServerDbContext context)
        {
            _context = context;
        }

        //GET: Users
        [HttpGet]
        [Route("[controller]/getAllUsers")]
        public string GetAllUsers()
        {
            return _context.Users != null ? _context.Users.ToJson()
                 : "";
        }


    }
}
