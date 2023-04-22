const RemoteRequestURLs = {
  // Basin Requests
  BASIN_GET_ALL_BASINS: "/api/basins/getAllBasins",
  BASIN_SAVE_NEW_BASIN: "/api/basins/saveBasin",
  BASIN_DELETE_BASIN: "/api/basins/deleteBasin",
  BASIN_SAVE_PERMISSIONS: "/api/basins/savePermissions",

  //User Requests
  USER_GET_ALL_USERS: "/api/users/getAllUsers",
  USER_SAVE_NEW_USER: "/api/users/saveUser",
  USER_DELETE_USER: "/api/users/deleteUser",

  //Model Requests
  MODEL_GET_ALL_MODELS: "/api/models/getAllModels",
  MODEL_SAVE_NEW_MODEL: "/api/models/saveModel",
  MODEL_DELETE_MODEL: "/api/models/deleteModel",
  MODEL_DOWNLOAD_MODEL_DATA: "/api/models/downloadModelData",
  MODEL_FIND_USER_MODELS: "/api/models/getModelsOfUser",
  
  // Session Requests
  SESSION_LOGIN_USER: "/api/session/loginUser",
  SESSION_LOGOUT_USER: "/api/session/logoutUser",
  SESSION_VALIDATE: "/api/session/validateSession",
};

export default RemoteRequestURLs;
