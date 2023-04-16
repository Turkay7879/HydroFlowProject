import RemoteRequestURLs from "../../RemoteRequestURLs";

const SessionsRemote = {
    loginUser: async (payload) => {
        let requestUrl = RemoteRequestURLs.SESSION_LOGIN_USER;
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
                // Session expired, alert user and process a logout
                this.logoutUser(payload).then(logoutResponse => {
                    if (logoutResponse.status === 404) {
                        console.log("user not found to log out");
                    } else if (logoutResponse.status === 200) {
                        window.localStorage.removeItem("hydroFlowSession");
                        callback(false);
                        // Redirect user
                    }
                })
            } else if (response.status === 500) {
                console.log("err, session to validate not found");
                callback(false);
            } else if (response.status === 200) {
                console.log("session is valid");
                callback(true);
            }
        });
    }
};

export default SessionsRemote;