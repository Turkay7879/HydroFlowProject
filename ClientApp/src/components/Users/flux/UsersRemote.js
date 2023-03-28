import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const UsersRemote = {
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
    }
};

export default UsersRemote;