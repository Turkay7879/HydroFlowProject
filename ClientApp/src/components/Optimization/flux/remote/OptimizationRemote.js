import RemoteRequestURLs from "../../../Constants/RemoteRequestURLs";

const OptimizationRemote = {
    getModelsOfUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_FIND_USER_MODELS;
        return await fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: payload
        });
    },
    getModelParameters: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_GET_PARAMETERS;
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
    saveModelParameters: async (payload) => {
        let requestUrl = RemoteRequestURLs.MODEL_SAVE_PARAMETERS;
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

export default OptimizationRemote;