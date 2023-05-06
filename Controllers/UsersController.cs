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
            var foundUser = _context.Users.ToList().Find(u => u.Email == user.Email);
            if (foundUser != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, userViewModel);
            }
            
            int newId;
            var newUserRole = new UserRole();
            var userRoles = _context.Roles.ToList();
            var regularUserRole = userRoles.Find(role => role.RoleValue == "user");
            if (user.Id == 0)
            {
                await _context.Users.AddAsync(user);
            }
            else
            {
                newId = user.Id;
                var toUpdate = await _context.Users.FindAsync(user.Id);
                if (toUpdate == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, userViewModel);
                }
                _context.Users.Entry(toUpdate).CurrentValues.SetValues(user);
            }

            int added = await _context.SaveChangesAsync();
            if (user.Id == 0 && added <= 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var addedUser = _context.Users.ToList().Find(u => u.Email == user.Email);
            if (addedUser == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, userViewModel);
            }
            
            newUserRole.UserId = addedUser.Id;
            newUserRole.RoleId = regularUserRole!.Id;
            await _context.UserRoles.AddAsync(newUserRole);
            await _context.SaveChangesAsync();
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

        [HttpPost]
        [Route("givePermissionsToUser")]
        public async Task<ActionResult<UserUserPermissionViewModel>> GivePermissionsToUser([FromBody] UserUserPermissionViewModel permissionViewModel)
        {
            var currentUser = await _context.Users.FindAsync(permissionViewModel.UserId);
            var permittedUser = _context.Users.ToList().Find(u => u.Email == permissionViewModel.PermittedUserMail);

            if (currentUser == null || permittedUser == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            if (!permissionViewModel.PermData && !permissionViewModel.PermDownload && !permissionViewModel.PermSimulation)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            var permission = _context.UserUserPermissions.ToList().Find(p => p.UserId == currentUser.Id && p.PermittedUserId == permittedUser.Id && p.ModelId == permissionViewModel.ModelId);
            var updateExistingPermission = false;
            if (permission != null) 
            {
                updateExistingPermission = true;
                var tempPermission = await _context.UserUserPermissions.FindAsync(permission.Id);
                tempPermission!.PermData = permissionViewModel.PermData;
                tempPermission!.PermDownload = permissionViewModel.PermDownload;
                tempPermission!.PermSimulation = permissionViewModel.PermSimulation;
            }
            else 
            {
                permission = new UserUserPermission
                {
                    ModelId = permissionViewModel.ModelId,
                    UserId = currentUser.Id,
                    PermittedUserId = permittedUser.Id,
                    PermData = permissionViewModel.PermData,
                    PermDownload = permissionViewModel.PermDownload,
                    PermSimulation = permissionViewModel.PermSimulation
                };
                await _context.UserUserPermissions.AddAsync(permission);
            } 

            int result = await _context.SaveChangesAsync();
            if (!updateExistingPermission && result == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return Ok(permission);
        }
    }
}
