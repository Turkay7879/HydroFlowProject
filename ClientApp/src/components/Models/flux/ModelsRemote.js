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
    /*deleteModel: async (model) => {
        console.log("Model to delete:", model);
        if (!window.confirm(`Are you sure you want to delete the model '${model.Name}'?`)) {
            return;
        }

        try {
            let requestUrl = RemoteRequestURLs.MODEL_DELETE_MODEL;
            let response = await fetch(requestUrl, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(model)
            });

            if (response.status === 200) {
                alert(`The model '${model.Name}' has been deleted successfully.`);
                this.refreshData();
            } else {
                console.log("Delete failed.");
            }
        } catch (error) {
            console.error(error);
            alert(`An error occurred while deleting the model '${model.Name}'.`);
        }
    }*/
    deleteModel: async (payload, callback) => {
        const requestUrl = "/api/models/deleteModel";
        const response = await fetch(requestUrl, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            callback();
        }
        return response;
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
