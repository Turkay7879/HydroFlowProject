import RemoteRequestURLs from "../../RemoteRequestURLs";

const SessionsRemote = {
    loginUser: (payload, callback) => {
        let requestUrl = RemoteRequestURLs.SESSION_LOGIN_USER;
        fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.status === 404 || response.status === 403) {
                callback(false, "Given e-mail or password is incorrect.");
            } else if (response.status === 500) {
                callback(false, "Could not create a session, please try again.");
            } else if (response.status === 200) {
                response.json().then(sessionData => {
                    window.localStorage.setItem("hydroFlowSession", JSON.stringify(sessionData));
                    callback(true);
                })
            }
        });
    },
    logoutUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.SESSION_LOGOUT_USER;
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
    validateSession: (payload, callback) => {
        let requestUrl = RemoteRequestURLs.SESSION_VALIDATE;
        fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: payload
        }).then(response => {
            if (response.status === 302) {
                console.log("session invalidated!");
                callback(false);
            } else if (response.status === 200) {
                callback(true);
            }
        });
    }
};

export default SessionsRemote;