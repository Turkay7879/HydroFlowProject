import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const allowedDataFileExtensions = ['xlsx'];
const allowedDataFileColumns = ['Date', 'P', 'PET', 'Obsmm'];

const ModelsRemote = {
       // This function makes a GET request to the server to retrieve all the available models.
        // It returns a Promise that resolves to the response from the server.
    getAllModels: async () => {
        let requestUrl = RemoteRequestURLs.MODEL_GET_ALL_MODELS;
        return await fetch(requestUrl);
    },

      // This function makes a POST request to the server to save a new model.
        // It takes in a payload object containing the details of the new model.
        // It returns a Promise that resolves to the response from the server.
    saveModel: async (payload) => {
        try {
            let requestUrl = RemoteRequestURLs.MODEL_SAVE_NEW_MODEL;
            return await fetch(requestUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

      // This function makes a DELETE request to the server to delete a model.
        // It takes in a payload object containing the ID of the model to be deleted.
        // It returns a Promise that resolves to the response from the server.
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

    // This function makes a POST request to the server to download observed data for a specific model.
        // It takes in a payload object containing the ID of the model.
        // It returns a Promise that resolves to the response from the server.
    downloadModelData: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_DOWNLOAD_MODEL_DATA;
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

     // This function makes a POST request to the server to retrieve the details of a specific model.
        // It takes in a payload object containing the ID of the model.
        // It returns a Promise that resolves to the response from the server.
    getDetailsOfModel: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_DETAILS_OF_MODEL;
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

     // This function makes a POST request to the server to check if a user has any models.
        // It takes in a payload object containing the email address of the user.
        // It returns a Promise that resolves to the response from the server.
    checkModelsOfUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODELS_OF_USER;
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
     // This function returns an array of allowed file extensions for data files.
    getAllowedExtensions: () => { return allowedDataFileExtensions },
      // This function returns an array of allowed column names for data files.
    getAllowedColumns: () => { return allowedDataFileColumns }
};

export default ModelsRemote;
