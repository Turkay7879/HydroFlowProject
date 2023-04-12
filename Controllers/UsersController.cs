using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HydroFlowProject.Data;
using HydroFlowProject.Models;
using HydroFlowProject.ViewModels;
using NuGet.Protocol;

namespace HydroFlowProject.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class UsersController : Controller
    {
        private readonly SqlServerDbContext _context;

        public UsersController(SqlServerDbContext context)
        {
            _context = context;
        }

        //GET: Users
        [HttpGet]
        [Route("getAllUsers")]
        public string GetAllUsers()
        {
            return _context.Users != null ? _context.Users.ToJson()
                 : "";
        }

        // POST: Save new user
        [HttpPost]
        [Route("saveUser")]
        public async Task<ActionResult<User>> SaveUser([FromBody] UserViewModel userViewModel)
        {
            User user = userViewModel.toUser();
            int newId;
            if (user.Id == 0)
            {
                await _context.Users.AddAsync(user);
                newId = user.Id;
            }
            else
            {
                newId = user.Id;
                var toUpdate = await _context.Users.FindAsync(user.Id);
                _context.Users.Entry(toUpdate).CurrentValues.SetValues(user);
            }

            int added = await _context.SaveChangesAsync();
            if (user.Id == 0 && added <= 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            userViewModel.Id = newId;
            return StatusCode(StatusCodes.Status200OK, userViewModel);
        }

        // DELETE: Delete an user
        [HttpDelete]
        [Route("deleteUser")]
        public async Task<ActionResult<User>> DeleteUser([FromBody] User user)
        {
            _context.Users.Remove(user);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(user);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

    }
}
