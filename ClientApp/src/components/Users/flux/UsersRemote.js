import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const UsersRemote = {
    getAllUsers: async () => {
        let requestUrl = RemoteRequestURLs.USER_GET_ALL_USERS;
        return await fetch(requestUrl);
    },
};

export default UsersRemote;