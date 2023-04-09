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
using System.Text;
using System.Diagnostics;

namespace HydroFlowProject.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class ModelsController : Controller
    {
        private readonly SqlServerDbContext _context;

        public ModelsController(SqlServerDbContext context)
        {
            _context = context;
        }

        // GET: Models
        [HttpGet]
        [Route("getAllModels")]
        public ActionResult<Model> GetAllModels()
        {
            List<Model> models = new();
            if (!_context.Models.Any())
            {
                return StatusCode(StatusCodes.Status404NotFound, "");
            }
            else
            {
                foreach (Model model in _context.Models.ToList())
                {
                    Model modelToReturn = new()
                    {
                        Name = model.Name,
                        Id = model.Id,
                        Title = model.Title,
                        ModelFile = new byte[0],
                        ModelPermissionId = model.ModelPermissionId,
                        CreateDate = model.CreateDate
                    };
                    models.Add(modelToReturn);
                }
                return Ok(models.ToJson());
            }
        }
        

        // POST: Save new model
        [HttpPost]
        [Route("saveModel")]
        public async Task<ActionResult<Model>> SaveModel([FromBody] ModelViewModel modelVM)
        {
            Model model = modelVM.ToModel();
            var toUpdate = await _context.Models.FindAsync(model.Id);
            if (toUpdate == null)
            {
                await _context.Models.AddAsync(model);
            }
            else
            {
                _context.Models.Entry(toUpdate).CurrentValues.SetValues(model);
            }

            int added = await _context.SaveChangesAsync();
            if (added > 0 || toUpdate != null)
            {
                return Ok(model);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        // POST: Save new model
        [HttpPost]
        [Route("downloadModelData")]
        public async Task<ActionResult<ModelViewModel>> DownloadModelData([FromBody] int Id)
        {
            var foundModel = await _context.Models.FindAsync(Id);
            if (foundModel == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            ModelViewModel modelVM = new ModelViewModel();
            modelVM.ModelFile = Convert.ToBase64String(foundModel.ModelFile);
            return Ok(modelVM);
        }

        /*  // DELETE: Delete a model
        [HttpDelete]
        [Route("deleteModel")]
        public async Task<ActionResult<Model>> DeleteModel([FromBody] Model model)
        {
            _context.Models.Remove(model);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(model);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }*/
        // DELETE: Delete a model
        [HttpDelete]
        [Route("deleteModel")]
        public async Task<ActionResult<Model>> DeleteModel([FromBody] int Id)
        {
            var modelToDelete = await _context.Models.FindAsync(Id);
            if (modelToDelete == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            _context.Models.Remove((Model) modelToDelete);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(modelToDelete);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
