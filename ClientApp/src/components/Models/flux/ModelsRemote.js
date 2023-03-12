
import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";
const ModelsRemote = {
    getAllModels: async () => {
        let requestUrl = RemoteRequestURLs.MODEL_GET_ALL_MODELS;
        return await fetch(requestUrl);
    },

    /*deleteModel: async (id) => {
        let requestUrl = RemoteRequestURLs.MODEL_DELETE_MODEL.replace("{id}", id);
        return await fetch(requestUrl, { method: "DELETE" });
    },*/

};

export default ModelsRemote;
