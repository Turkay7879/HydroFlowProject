import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const UsersRemote = {

    //a request is created to the .net side for operations such as getting data about the user, updating them.

    getAllUsers: async () => {
        let requestUrl = RemoteRequestURLs.USER_GET_ALL_USERS;
        return await fetch(requestUrl);
    },
    saveUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.USER_SAVE_NEW_USER;
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
    deleteUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.USER_DELETE_USER;
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
    givePermissionsToUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.USER_GIVE_SIMULATION_PERMISSIONS_TO_USER;
        return await fetch(requestUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    },
    checkUserPermissionsForModels: async (payload) => {
        let requestUrl = RemoteRequestURLs.USER_CHECK_USER_PERMISSIONS_FOR_MODELS;
        return await fetch(requestUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    }
};

export default UsersRemote;