import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const BasinsRemote = {
  getAllBasins: async () => {
    let requestUrl = RemoteRequestURLs.BASIN_GET_ALL_BASINS;
    return await fetch(requestUrl);
  },
  saveBasin: async (payload) => {
    let requestUrl = RemoteRequestURLs.BASIN_SAVE_NEW_BASIN;
    return await fetch(requestUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload) 
    });
  },
  savePermissions: async (payload) => {
    let requestUrl = RemoteRequestURLs.BASIN_SAVE_PERMISSIONS;
    return await fetch(requestUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },
  deleteBasin: async (payload) => {
    let requestUrl = RemoteRequestURLs.BASIN_DELETE_BASIN;
    return await fetch(requestUrl, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  findModelsOfBasin: async (payload) => {
    let requestUrl = RemoteRequestURLs.BASIN_FIND_MODELS_OF_BASIN;
    return await fetch(requestUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }
};

export default BasinsRemote;
