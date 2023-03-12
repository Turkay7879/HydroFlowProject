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
        public string GetAllModels()
        {
            return _context.Models != null
              ? _context.Models.ToJson()
              : "";
        }

        // POST: Save new Model
        [HttpPost]
        [Route("saveModel")]
        public async Task<ActionResult<Model>> SaveModel([FromBody] Model Model)
        {
            await _context.Models.AddAsync(Model);
            int added = await _context.SaveChangesAsync();
            if (added > 0)
            {
                return Ok(Model);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        /*
                // DELETE: Delete a Model
                [HttpDelete]
                [Route("deleteModel/{id}")]
                public async Task<ActionResult<Model>> DeleteModel(int id)
                {
                    var Model = await _context.Models.FindAsync(id);
                    if (Model == null)
                    {
                        return NotFound();
                    }

                    _context.Models.Remove(Model);
                    int deleted = await _context.SaveChangesAsync();
                    if (deleted > 0)
                    {
                        return Ok(Model);
                    }
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
        */
        // PUT: Update a Model
        /*
        [HttpPut]
        [Route("editModel/{id}")]
        public async Task<IActionResult> EditModel(int id, [FromBody] Model updatedModel)
        {
            var existingModel = await _context.Models.FindAsync(id);
            if (existingModel == null)
            {
                return NotFound();
            }

            existingModel.Name = updatedModel.Name;
            existingModel.Description = updatedModel.Description;
            existingModel.Category = updatedModel.Category;

            _context.Models.Update(existingModel);
            int updated = await _context.SaveChangesAsync();
            if (updated > 0)
            {
                return Ok(existingModel);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }*/

    }
}