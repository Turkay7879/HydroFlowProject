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

        // POST: Save new model
        [HttpPost]
        [Route("saveModel")]
        public async Task<ActionResult<Model>> SaveModel([FromBody] Model model)
        {
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
        public async Task<ActionResult<Model>> DeleteModel([FromBody] Model model)
        {
            _context.Models.Remove(model);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(model);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
