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
    }
};

export default OptimizationRemote;