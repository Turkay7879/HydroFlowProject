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
using HydroFlowProject.Utilities;
using Newtonsoft.Json;
using System.Reflection.Metadata;
using System.Linq.Expressions;
using Microsoft.Data.SqlClient;

namespace HydroFlowProject.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class ModelsController : Controller
    {
        private readonly SqlServerDbContext _context;
        private readonly int MAX_MODEL_NUM_CREATED_BY_NORMAL_USERS_IN_A_DAY = 5;

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
                        ModelFile = Array.Empty<byte>(),
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
        public async Task<ActionResult<ModelViewModel>> SaveModel([FromBody] ModelViewModel modelVM)
        {
            Model model = modelVM.ToModel();
            var userSession = _context.Sessions.ToList().Find(s => s.SessionId == modelVM.SessionId);
            if (userSession == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var toUpdate = await _context.Models.FindAsync(model.Id);
            var id = -1;
            if (toUpdate == null)
            {
                var userRole = _context.UserRoles.ToList().Find(ur => ur.UserId == userSession.UserId);
                var userId = new SqlParameter("userId", userSession.UserId);
                var modelCountInADay = _context.Database.SqlQueryRaw<int>($"select count(dbo.Models.Id) as 'count' from dbo.Models\r\ninner join dbo.User_Models on dbo.User_Models.ModelId = dbo.Models.Id\r\nwhere dbo.User_Models.UserId = @userId\r\nand dbo.Models.CreateDate > (GETDATE() - 1)", userId).ToList();
                if (modelCountInADay.ElementAt(0) > MAX_MODEL_NUM_CREATED_BY_NORMAL_USERS_IN_A_DAY && userRole!.RoleId == 3)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "Regular users are not allowed to create more than " + MAX_MODEL_NUM_CREATED_BY_NORMAL_USERS_IN_A_DAY + " simulations in the last 24 hours!");
                }

                await _context.Models.AddAsync(model);
            }
            else
            {
                _context.Models.Entry(toUpdate).CurrentValues.SetValues(model);
                id = model.Id;
            }

            int added = await _context.SaveChangesAsync();
            id = model.Id;
            if (toUpdate == null && added == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            
            if (added > 0)
            {       
                var parameters = new List<ModelParameter>
                {
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 1f, Model_Param_Name = "a"},
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 5f, Model_Param_Name = "b"},
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 0.5f, Model_Param_Name = "c"},
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 0.1f, Model_Param_Name = "d"},
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 2f, Model_Param_Name = "initialSt"},
                    new ModelParameter{Model_Id = id, User_Id = userSession.UserId, Model_Param = 2f, Model_Param_Name = "initialGt"},
                };
                
                await _context.UserModels.AddAsync(new UserModel
                {
                    UserId = userSession.UserId,
                    ModelId = id
                });

                await _context.BasinModels.AddAsync(new BasinModel
                {
                    BasinId = modelVM.BasinId,
                    ModelId = id
                });

                await _context.ModelModelTypes.AddAsync(new ModelModelType
                {
                    Model_Type_Id = 1,
                    Model_Id = id
                });

                await _context.ModelParameters.AddRangeAsync(parameters);
                
                await _context.SaveChangesAsync();
            }

            modelVM.Id = id;
            modelVM.ModelFile = "";
            modelVM.SessionId = "";
            return Ok(modelVM);
        }

        [HttpPost]
        [Route("getModelParameters")]
        public ActionResult<ModelParameterViewModel> GetModelParameters([FromBody] Dictionary<string, int> modelUserIds)
        {
            var parameters = _context.ModelParameters.ToList().FindAll(p => p.Model_Id == modelUserIds["Model_Id"] && p.User_Id == modelUserIds["User_Id"]);
            var modelingTypeId = _context.ModelModelTypes.ToList().Find(mt => mt.Model_Id == modelUserIds["Model_Id"]);
            var modelingType = _context.BalanceModelTypes.Find(modelingTypeId!.Model_Type_Id);
            var modelParameters = new ModelParameterViewModel
            {
                Parameters = parameters,
                ModelingType = modelingType!.ModelType_Definition
            };
            return Ok(modelParameters);
        }

        [HttpPost]
        [Route("saveModelParameters")]
        public async Task<ActionResult<ModelParameterSaveViewModel>> SaveModelParameters([FromBody] ModelParameterSaveViewModel modelParameters)
        {
            var relatedUser = await _context.Users.FindAsync(modelParameters.User_Id);
            var relatedModel = await _context.Models.FindAsync(modelParameters.Model_Id);

            if (relatedUser == null || relatedModel == null) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError, modelParameters);
            }

            try
            {
                var tempObj = JsonConvert.DeserializeObject<object>(modelParameters.Parameter_Map);
                var tempJson = JsonConvert.SerializeObject(tempObj);
                var parameters = JsonConvert.DeserializeObject<Dictionary<int, float>>(tempJson);
                if (parameters == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, modelParameters);
                }

                foreach (var (Parameter_Id, Model_Param) in parameters)
                {
                    var parameterFromDb = await _context.ModelParameters.FindAsync(Parameter_Id);

                    if (parameterFromDb == null)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, modelParameters);
                    }

                    parameterFromDb.Model_Param = Model_Param;
                }

                var simulationDetails = new SimulationDetails
                {
                    User_Id = relatedUser.Id,
                    Model_Id = relatedModel.Id,
                    Model_Name = relatedModel.Name,
                    Version = 0,
                    Optimization_Percentage = modelParameters.Optimization_Percentage
                };
                _context.SimulationDetails.Add(simulationDetails);

                await _context.SaveChangesAsync();
                return Ok(modelParameters);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(StatusCodes.Status500InternalServerError, modelParameters);
            }
        }
        
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

            var basinModel = _context.BasinModels.FirstOrDefault(b => b.ModelId == Id);
            var modelType = _context.ModelModelTypes.FirstOrDefault(t => t.Model_Id == Id);
            var parameterList = _context.ModelParameters.ToList().FindAll(mp => mp.Model_Id == Id);
            var simulationDetails = _context.SimulationDetails.ToList().FindAll(sd => sd.Model_Id == Id);
            var userModels = _context.UserModels.ToList().FindAll(um => um.ModelId == Id);
            var permissions = _context.UserUserPermissions.ToList().FindAll(p => p.ModelId == Id);

            _context.BasinModels.Remove(basinModel!);
            _context.ModelModelTypes.Remove(modelType!);
            _context.ModelParameters.RemoveRange(parameterList);
            _context.SimulationDetails.RemoveRange(simulationDetails);
            _context.UserModels.RemoveRange(userModels);
            _context.UserUserPermissions.RemoveRange(permissions);

            _context.Models.Remove(modelToDelete);
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(modelToDelete);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpPost]
        [Route("getModelsOfUser")]
        public async Task<ActionResult<ModelViewModel>> GetModelsOfUser([FromBody] SessionViewModel session)
        {
            var userSession = _context.Sessions.ToList().Find(s => s.SessionId == session.SessionId);
            if (userSession == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var userModels = _context.UserModels.ToList().FindAll(um => um.UserId == userSession.UserId);
            if (userModels.Count == 0)
            {
                return Ok(Array.Empty<ModelViewModel>());
            }

            var modelList = new ArrayList();
            foreach (var um in userModels)
            {
                var model = await _context.Models.FindAsync(um.ModelId);
                modelList.Add(new ModelViewModel {
                    Id = model!.Id,
                    Name = model.Name,
                    Title = model.Title,
                    ModelFile = "",
                    ModelPermissionId = model.ModelPermissionId
                });
            }

            return Ok(modelList);
        }

        [HttpPost]
        [Route("getDetailsOfModel")]
        public async Task<ActionResult<Dictionary<string, object>>> GetDetailsOfModel([FromBody] Dictionary<string, int> idMap)
        {
            var modelId = idMap["modelId"];
            var userIdFromMap = idMap["userId"];
            var model = await _context.Models.FindAsync(modelId);
            if (model == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, modelId);
            }

            var resultMap = new Dictionary<string, object>();

            var modelParameters = new List<ModelParameter>();
            if (userIdFromMap != 0)
            {
                modelParameters = _context.ModelParameters.ToList().FindAll(mp => mp.Model_Id == modelId && mp.User_Id == userIdFromMap);
            } 
            else
            {
                var originalCreatorOfSimulation = _context.UserModels.First(um => um.ModelId == modelId)!.UserId;
                modelParameters = _context.ModelParameters.ToList().FindAll(mp => mp.Model_Id == modelId && mp.User_Id == originalCreatorOfSimulation);
            }

            var parameterList = new ArrayList();
            foreach (var param in modelParameters)
            {
                var tempMap = new Dictionary<string, object>
                {
                    { "parameter", param.Model_Param },
                    { "name", param.Model_Param_Name }
                };
                parameterList.Add(tempMap);
            }

            var modelTypeId = _context.ModelModelTypes.ToList().Find(mmt => mmt.Model_Id == modelId)!.Model_Type_Id;
            var modelType = await _context.BalanceModelTypes.FindAsync(modelTypeId);

            resultMap.Add("parameters", parameterList);
            resultMap.Add("modelType", modelType!.ModelType_Definition);

            var userId = _context.UserModels.ToList().Find(um => um.ModelId == modelId)!.UserId;
            var user = await _context.Users.FindAsync(userId);
            var userConsent = _context.UserConsents.ToList().Find(uc => uc.User_Id == userId);
            var userInfoMap = new Dictionary<string, object>();
            if (userConsent!.Consent)
            {
                userInfoMap.Add("name", user!.Name);
                userInfoMap.Add("email", user!.Email);
            }
            else
            {
                userInfoMap.Add("name", "Anonymous");
                userInfoMap.Add("email", "Anonymous");
            }
            resultMap.Add("user", userInfoMap);

            var simulationList = _context.SimulationDetails
                .ToList()
                .FindAll(details => details.User_Id == user!.Id && details.Model_Id == modelId);
            var simulationDetails = new SimulationDetails();
            if (simulationList.Count == 0)
            {
                return StatusCode(StatusCodes.Status412PreconditionFailed, "This simulation needs to be run and saved with parameters first to view its details!");
            }
            else
            {
                simulationDetails = simulationList
                    .OrderByDescending(details => details.Version)
                    .ElementAt(0);
            }
                
            var simulationDetailsMap = new Dictionary<string, object>
            {
                { "modelName", simulationDetails.Model_Name },
                { "version", simulationDetails.Version },
                { "updateDate", simulationDetails.Simulation_Date! },
                { "percentage", simulationDetails.Optimization_Percentage }
            };
            resultMap.Add("latestDetails", simulationDetailsMap);

            return Ok(resultMap);
        }

        [HttpPost]
        [Route("optimize")]
        public ActionResult<OptimizationViewModel> Optimize([FromBody] OptimizationViewModel optimizationVM)
        {
            var checkModelType = _context.BalanceModelTypes.ToList().Find(bmt => bmt.ModelType_Definition == optimizationVM.Model_Type);
            if (checkModelType == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, optimizationVM);
            }

            return Ok(ModelOptimization.Optimize(optimizationVM));
        }

        [HttpPost]
        [Route("checkModelsOfUser")]
        public async Task<ActionResult<UserModel>> CheckModelsOfUser([FromBody] CheckModelsOfUserViewModel checkModelsOfUserVM)
        {
            var userModel = new UserModel();
            var foundUserModel = _context.UserModels.ToList().Find(um => um.UserId == checkModelsOfUserVM.User_Id && um.ModelId == checkModelsOfUserVM.Model_Id);
            if(foundUserModel == null)
            {   
                userModel.UserId = checkModelsOfUserVM.User_Id;
                userModel.ModelId = checkModelsOfUserVM.Model_Id;
                await _context.UserModels.AddAsync(userModel);
                await _context.SaveChangesAsync();

                var parameters = new List<ModelParameter>
                {
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 1f, Model_Param_Name = "a"},
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 5f, Model_Param_Name = "b"},
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 0.5f, Model_Param_Name = "c"},
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 0.1f, Model_Param_Name = "d"},
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 2f, Model_Param_Name = "initialSt"},
                    new ModelParameter{Model_Id = checkModelsOfUserVM.Model_Id, User_Id = checkModelsOfUserVM.User_Id, Model_Param = 2f, Model_Param_Name = "initialGt"},
                };

                await _context.ModelParameters.AddRangeAsync(parameters);

                await _context.SaveChangesAsync();
            }

            return StatusCode(StatusCodes.Status302Found);
        }
    }
}
