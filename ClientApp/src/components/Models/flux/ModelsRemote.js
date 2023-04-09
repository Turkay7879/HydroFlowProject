import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const ModelsRemote = {
    getAllModels: async () => {
        let requestUrl = RemoteRequestURLs.MODEL_GET_ALL_MODELS;
        return await fetch(requestUrl);
    },


    saveModel: async (payload) => {
        try {
            let requestUrl = RemoteRequestURLs.MODEL_SAVE_NEW_MODEL;
            const response = await fetch(requestUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    ,

   
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
    }
};

export default ModelsRemote;
