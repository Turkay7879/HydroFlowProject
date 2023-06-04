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
        // Return a list of all available basins
        [HttpGet]
        [Route("getAllBasins")]
        public ActionResult<List<BasinViewModel>> GetAllBasins()
        {
            if (!_context.Basins.Any())
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            List<BasinViewModel> allBasins = new List<BasinViewModel>();

            foreach (Basin basin in _context.Basins.ToList())
            {
                BasinViewModel bvm = new BasinViewModel();
                bvm = bvm.fromBasin(basin);
                allBasins.Add(bvm);
            }
            foreach (BasinViewModel bvm in allBasins)
            {
                List<BasinPermission> permissionList = _context.BasinPermissions.Where(perm => perm.BasinId == bvm.Id).ToList();
                BasinPermission permission = permissionList.ElementAt(0);
                bvm.BasinPerm = permission.BasinPermissionType == null ? false : (bool)permission.BasinPermissionType;
                bvm.BasinSpecPerm = permission.BasinSpecPerm == null ? false : (bool)permission.BasinSpecPerm;
                bvm.UserSpecPerm = permission.UserSpecPerm == null ? false : (bool)permission.UserSpecPerm;
            }

            return Ok(allBasins);
        }

        // POST: Save new basin
        // Takes a BasinViewModel as payload, converts to Basin model and saves it afterwards
        [HttpPost]
        [Route("saveBasin")]
        public async Task<ActionResult<Basin>> SaveBasin([FromBody] BasinViewModel basinVM)
        {
            Basin basin = basinVM.toBasin();
            var toUpdate = await _context.Basins.FindAsync(basin.Id);
            if (toUpdate == null)
            {
                await _context.Basins.AddAsync(basin);
            } else
            {
                _context.Basins.Entry(toUpdate).CurrentValues.SetValues(basin);
            }
            
            int added = await _context.SaveChangesAsync();
            if (toUpdate == null && added <= 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            BasinPermission permissions = new BasinPermission();
            permissions.BasinId = basin.Id;
            permissions.BasinPermissionType = basinVM.BasinPerm;
            permissions.BasinSpecPerm = basinVM.BasinSpecPerm;
            permissions.UserSpecPerm = basinVM.UserSpecPerm;

            // Create or update basin permissions
            List<BasinPermission> permToUpdate = _context.BasinPermissions.Where(perm => perm.BasinId == basin.Id).ToList();
            if (permToUpdate == null || permToUpdate.Capacity <= 0)
            {
                await _context.BasinPermissions.AddAsync(permissions);
            } else
            {
                var permission = _context.BasinPermissions.FirstOrDefault(p => p.BasinId == basin.Id);
                permission!.BasinPermissionType = basinVM.BasinPerm;
                permission.BasinSpecPerm = basinVM.BasinSpecPerm;
                permission.UserSpecPerm = basinVM.UserSpecPerm;
            }

            int addedPerm = await _context.SaveChangesAsync();
            if ((permToUpdate == null || permToUpdate.Capacity <= 0) && addedPerm <= 0)
            {
                _context.Basins.Remove(basin);
                await _context.SaveChangesAsync();
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return StatusCode(StatusCodes.Status200OK, basinVM);
        }

        // DELETE: Delete a basin
        // Takes a Basin model as payload, and deletes it from database including permissions
        [HttpDelete]
        [Route("deleteBasin")]
        public async Task<ActionResult<Basin>> DeleteBasin([FromBody] Basin basin)
        {
            // Check if basin has simulations in it first
            var basinHasModels = _context.BasinModels.ToList().Find(bm => bm.BasinId == basin.Id);
            if (basinHasModels != null)
            {
                return StatusCode(StatusCodes.Status412PreconditionFailed, "This basin has simulations created in it!");
            }

            var basinPerm = _context.BasinPermissions.FirstOrDefault(bm => bm.BasinId.Equals(basin.Id));
            if (basinPerm != null)
            {
                _context.BasinPermissions.Remove(basinPerm);
            }

            _context.Basins.Remove(basin);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(basin);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        // POST: Save Basin Permissions
        // Updates basin permissions by taking BasinPermissionViewModel payload
        [HttpPost]
        [Route("savePermissions")]
        public async Task<ActionResult<BasinPermissionViewModel>> SavePermissions([FromBody] BasinPermissionViewModel basinPermVM)
        {
            // Check if given basin actually exists
            List<BasinPermission> toUpdate = _context.BasinPermissions.Where(perm => perm.BasinId == basinPermVM.BasinId).ToList();
            if (toUpdate == null || toUpdate.Capacity == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            BasinPermission permission = toUpdate.ElementAt(0);
            permission.BasinId = basinPermVM.BasinId;
            permission.BasinPermissionType = basinPermVM.BasinPermissionType;
            permission.BasinSpecPerm = basinPermVM.BasinSpecPerm;
            permission.UserSpecPerm = basinPermVM.UserSpecPerm;

            _context.BasinPermissions.Entry(toUpdate.ElementAt(0)).CurrentValues.SetValues(permission);
            await _context.SaveChangesAsync();
            return Ok(basinPermVM);
        }

        // Find simulations created in a basin
        [HttpPost]
        [Route("findModelsOfBasin")]
        public async Task<ActionResult<Dictionary<string, object>>> FindModelsOfBasin([FromBody] RestrictedBasinModelsViewModel payload)
        {
            var isUserHasValidSession = _context.Sessions.ToList().Find(s => s.SessionId == payload.SessionId && s.SessionIsValid == true) != null;
            var modelIdList = _context.BasinModels.ToList().FindAll(bm => bm.BasinId == payload.BasinId);
            var modelList = new ArrayList();

            // Basin has no simulations
            if (modelIdList.Count == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, modelList);
            }

            // Add simulations allowed to the current session user to the modelList
            // Use isUserEligibleToViewModel flag for each simulation
            foreach (var basinModel in modelIdList)
            {
                var model = await _context.Models.FindAsync(basinModel.ModelId);
                var isUserEligibleToViewModel = false;

                // Simulation is already public, user is allowed
                if (model!.ModelPermissionId == 0)
                {
                    isUserEligibleToViewModel = true;
                }

                // Simulation is private, additional control required
                else if (isUserHasValidSession && model.ModelPermissionId == 1) 
                {
                    var isUserHasPermissionToViewModel = _context.UserUserPermissions.ToList().Find(uup => uup.ModelId == model.Id && uup.PermittedUserId == payload.UserId);
                    var isUserCreatedModel = _context.UserModels.ToList().Find(um => um.UserId == payload.UserId && um.ModelId == model.Id);
                    
                    // If user has permissions to view current private simulation from its original creator
                    // OR this private simulation is current session users own simulation, user is allowed
                    if (isUserHasPermissionToViewModel != null || isUserCreatedModel != null)
                    {
                        isUserEligibleToViewModel = true;
                    }
                }

                if (isUserEligibleToViewModel)
                {
                    modelList.Add(new ModelViewModel
                    {
                        Id = model!.Id,
                        Name = model.Name,
                        Title = model.Title,
                        ModelFile = "",
                        ModelPermissionId = model.ModelPermissionId,
                        SessionId = null,
                        BasinId = payload.BasinId
                    });
                }
            }

            // Check total simulations created in this basin
            var totalCount = _context.Database.SqlQuery<int>($"select count(distinct dbo.Basin_Models.ModelId) from dbo.Basin_Models\ninner join dbo.User_Models on dbo.User_Models.ModelId = dbo.Basin_Models.ModelId");
            
            Dictionary<string, object> resultMap = new()
            {
                { "totalCount", totalCount },
                { "modelList", modelList }
            };

            return Ok(resultMap);
        }
    }
}
