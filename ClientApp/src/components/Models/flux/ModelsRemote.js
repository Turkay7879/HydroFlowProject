import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const ModelsRemote = {
    getAllModels: async () => {
        let requestUrl = RemoteRequestURLs.MODEL_GET_ALL_MODELS;
        return await fetch(requestUrl);
    },
    saveModel: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_SAVE_NEW_MODEL;
        return await fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });
    },
  
    deleteModel: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_DELETE_MODEL;
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


   
      addModel: async (formData) => {
        const requestUrl = RemoteRequestURLs.MODEL_SAVE_NEW_MODEL;
        const response = await fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });
        return response;
    }
};
export default ModelsRemote;
