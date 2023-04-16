import React from "react";
import {Form, FormGroup, Input, Label} from "reactstrap";
import {Navigate} from "react-router-dom";
import UsersRemote from "../flux/UsersRemote";
import "../styles/Register.css";
import SessionsRemote from "../../Constants/flux/remote/SessionsRemote";

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            surname: null,
            corporationName: null,
            email: null,
            password: null,
            confirmPassword: null,
            validSessionPresent: false
        }
    }
    
    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        SessionsRemote.validateSession(session, (status) => status ? this.setState({ validSessionPresent: true }) : null);
    }

    register = () => {
        if (!this.state.password || !this.state.confirmPassword || this.state.password !== this.state.confirmPassword) {
            // Alert about password mismatch
            return;
        }
        if (!this.state.name || this.state.name.trim().length === 0 ||
            !this.state.surname || this.state.surname.trim().length === 0 ||
            !this.state.corporationName || this.state.corporationName.trim().length === 0 ||
            !this.state.email || this.state.email.trim().length === 0 ||
            !this.state.password || this.state.name.trim().length === 0) {
            // Alert about empty fields
            return;
        }
        
        let userToRegister = {
            Name: this.state.name,
            Surname: this.state.surname,
            CorporationName: this.state.corporationName,
            Email: this.state.email,
            Password: this.state.password
        };
        UsersRemote.saveUser(userToRegister).then(response => {
           if (response.status !== 200) {
               // Alert about failed save
           } else {
               SessionsRemote.loginUser({
                   Email: userToRegister.Email,
                   Password: userToRegister.Password
               }).then(response => {
                   if (response.status === 404) {
                       console.log("failed to save user in previous request")
                   } else if (response.status === 403) {
                       console.log("something went wrong with password checking")
                   } else if (response.status === 500) {
                       console.log("error, credentials are approved, but could not create session")
                   } else if (response.status === 200) {
                       response.json().then(sessionData => {
                           window.localStorage.setItem("hydroFlowSession", JSON.stringify(sessionData));
                           // Registration Success! Inform user, then redirect to home page
                       })
                   }
               })
           }
        });
    }

    render() {
        return this.state.validSessionPresent ? <Navigate to={"/"}/> : (
            <>
                <h1 style={{ textAlign: "center" }}>Register to HydroFlow</h1>
                <div className={"registerFormDiv"}>
                    <Form>
                        <FormGroup>
                            <Label for={"nameField"}>Name</Label>
                            <Input
                                id="nameField"
                                name="name"
                                type="text"
                                required={true}
                                defaultValue={this.state.name ? this.state.name : ""}
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"surnameField"}>Surname</Label>
                            <Input
                                id="surnameField"
                                name="surname"
                                type="text"
                                required={true}
                                defaultValue={this.state.surname ? this.state.surname : ""}
                                onChange={(e) => this.setState({ surname: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"corpNameField"}>Corporation Name</Label>
                            <Input
                                id="corpNameField"
                                name="corpName"
                                type="text"
                                required={true}
                                defaultValue={this.state.corporationName ? this.state.corporationName : ""}
                                onChange={(e) => this.setState({ corporationName: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"emailField"}>E-mail</Label>
                            <Input
                                id="emailField"
                                name="email"
                                type="email"
                                required={true}
                                defaultValue={this.state.email ? this.state.email : ""}
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"passwordField"}>Password</Label>
                            <Input
                                id="passwordField"
                                name="password"
                                type="password"
                                required={true}
                                defaultValue={this.state.password ? this.state.password : ""}
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={"confirmPasswordField"}>Confirm Password</Label>
                            <Input
                                id="confirmPasswordField"
                                name="confirmPassword"
                                type="password"
                                required={true}
                                defaultValue={this.state.confirmPassword ? this.state.confirmPassword : ""}
                                onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </div>
                <div className={"registerButton"}>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.register}>
                        Register
                    </button>
                </div>
            </>
        );
    }
}

export default Registration;