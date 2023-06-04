import RemoteRequestURLs from "../../RemoteRequestURLs";

// Define an object called SessionsRemote with 3 methods: loginUser, logoutUser, and validateSession
const SessionsRemote = {
    loginUser: (payload, callback) => {
        // Set the request URL to the SESSION_LOGIN_USER endpoint from the RemoteRequestURLs module
        let requestUrl = RemoteRequestURLs.SESSION_LOGIN_USER;
        // Make a POST request to the endpoint with the given payload
        fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            // If the response status is 404 (Not Found) or 403 (Forbidden), call the callback with an error message
            if (response.status === 404 || response.status === 403) {
                callback(false, "Given e-mail or password is incorrect.");
                // If the response status is 500 (Internal Server Error), call the callback with an error message
            } else if (response.status === 500) {
                callback(false, "Could not create a session, please try again.");
                // If the response status is 200 (OK), parse the response body as JSON and call the callback with the session data
            } else if (response.status === 200) {
                response.json().then(sessionData => {
                    window.localStorage.setItem("hydroFlowSession", JSON.stringify(sessionData));
                    callback(true);
                })
            }
        });
    },
    logoutUser: async (payload) => {
        // Set the request URL to the SESSION_LOGOUT_USER endpoint from the RemoteRequestURLs module
        let requestUrl = RemoteRequestURLs.SESSION_LOGOUT_USER;
        // Make a POST request to the endpoint with the given payload
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
        // Set the request URL to the SESSION_VALIDATE endpoint from the RemoteRequestURLs module
        let requestUrl = RemoteRequestURLs.SESSION_VALIDATE;
        // Make a POST request to the endpoint with the given payload
        fetch(requestUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: payload
        }).then(response => {
            // If the response status is 302 (Found), call the callback with false to indicate the session is invalid
            if (response.status === 302) {
                console.log("session invalidated!");
                callback(false);
                // If the response status is 200 (OK), call the callback with true to indicate the session is valid
            } else if (response.status === 200) {
                callback(true);
            }
        });
    }
};

// Export the SessionsRemote object as the default module export
export default SessionsRemote;