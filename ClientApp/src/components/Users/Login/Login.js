import React from "react";
import {Form, FormGroup, Label, Input, Spinner, Button} from "reactstrap";
import {Navigate} from "react-router-dom";
import "../styles/Login.css";
import SessionsRemote from "../../Constants/flux/remote/SessionsRemote";
import Swal from "sweetalert2";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            validSessionPresent: false,
            loggingIn: false
        }
    }
    
    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            SessionsRemote.validateSession(session, (status) =>
                status ? this.setState({ validSessionPresent: true }) : null);
        }
    }

    login = () => {
        if (!this.state.email || this.state.email.trim().length === 0
        || !this.state.password || this.state.password.trim().length === 0) {
            return Swal.fire({
                title: "Missing Fields",
                text: "Please fill the login fields!",
                icon: "warning"
            });
        }
        
        let loginPayload = {
            Email: this.state.email,
            Password: this.state.password
        };
        this.setState({ loggingIn: true }, () => {
            SessionsRemote.loginUser(loginPayload, (result, errorMessage) => {
                if (result) {
                    this.setState({
                        loggingIn: false,
                        validSessionPresent: true
                    });
                } else {
                    this.setState({ loggingIn: false, validSessionPresent: false });
                    Swal.fire({
                        title: "Login Error",
                        text: errorMessage,
                        icon: "error"
                    });
                }
            });
        })
    }
    
    render() {
        return this.state.validSessionPresent ? <Navigate to={"/"}/> : (
            <>
                <h1 style={{ textAlign: "center" }}>Login to HydroFlow</h1>
                <div className={"loginFormDiv"}>
                    <Form>
                        <FormGroup>
                            <Label for={"emailField"}>E-mail</Label>
                            <Input
                                id="emailField"
                                name="Email"
                                type="email"
                                required={true}
                                defaultValue={this.state.email ? this.state.email : ""}
                                onKeyDown={(e) => e.key === 'Enter' && this.login()}
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"emailField"}>Password</Label>
                            <Input
                                id="passwordField"
                                name="Password"
                                type="password"
                                required={true}
                                defaultValue={this.state.password ? this.state.password : ""}
                                onKeyDown={(e) => e.key === 'Enter' && this.login()}
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </div>
                <div className={"loginButton"}>
                    {
                        this.state.loggingIn ? <Button color="primary" disabled>
                            <Spinner size="sm">
                                Loading...
                            </Spinner>
                            <span>
                            {' '} Logging In
                        </span>
                        </Button> : <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.login}>
                            Login
                        </button>
                    }
                </div>
          </>  
        );
    }
}

export default Login;