import React from "react";
import {Form, FormGroup, Input, Label, Button, Spinner} from "reactstrap";
import {Checkbox, FormControlLabel} from "@mui/material";
import {Navigate} from "react-router-dom";
import UsersRemote from "../flux/UsersRemote";
import "../styles/Register.css";
import SessionsRemote from "../../Constants/flux/remote/SessionsRemote";
import Swal from "sweetalert2";

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
            consentSharing: false,
            validSessionPresent: false,
            registering: false
        }
    }
    
    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            SessionsRemote.validateSession(session, (status) => 
                status ? this.setState({ validSessionPresent: true }) : null);
        }
    }

    register = () => {
        if (!this.state.name || this.state.name.trim().length === 0 ||
            !this.state.surname || this.state.surname.trim().length === 0 ||
            !this.state.corporationName || this.state.corporationName.trim().length === 0 ||
            !this.state.email || this.state.email.trim().length === 0 ||
            !this.state.password || this.state.name.trim().length === 0 ||
            !this.state.confirmPassword || this.state.confirmPassword.trim().length === 0) {
            return Swal.fire({
                title: "Empty Fields",
                text: "Please make sure to fill all registration form fields!",
                icon: "warning"
            });
        }

        if (this.state.password !== this.state.confirmPassword) {
            return Swal.fire({
                title: "Password Mismatch",
                text: "Make sure to type the same password for confirm password field!",
                icon: "warning"
            });
        }
        
        let userToRegister = {
            Name: this.state.name,
            Surname: this.state.surname,
            CorporationName: this.state.corporationName,
            Email: this.state.email,
            Password: this.state.password,
            Consent: this.state.consentSharing
        };
        this.setState({ registering: true }, () => {
            UsersRemote.saveUser(userToRegister).then(response => {
                if (response.status !== 200) {
                    this.setState({ registering: false }, () => {
                        Swal.fire({
                            title: "Failed to Register",
                            text: "Registration failed. Please try again!",
                            icon: "error"
                        });
                    });
                } else {
                    SessionsRemote.loginUser({
                        Email: userToRegister.Email,
                        Password: userToRegister.Password
                    }, (result) => {
                        if (result) {
                            this.setState({ 
                                validSessionPresent: true,
                                registering: false
                            });
                        }
                    })
                }
            });
        });
    }

    render() {
        return this.state.validSessionPresent ? <Navigate to={"/"}/> : (
            <div className="registerContainer">
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
                        <FormGroup>
                            <FormControlLabel
                                label="I consent to share my contact information to be shown in basin details if created a simulation."
                                control={<Checkbox 
                                    checked={this.state.consentSharing}
                                    onChange={() => this.setState({ consentSharing: !this.state.consentSharing })}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />}
                            />
                        </FormGroup>
                    </Form>
                </div>
                <div className={"registerButton"}>
                    {
                        this.state.registering ? <Button color="primary" disabled>
                            <Spinner size="sm">
                                Loading...
                            </Spinner>
                            <span>
                                {' '} Registering
                            </span>
                        </Button> : <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.register}>
                            Register
                        </button>
                    }
                </div>
            </div>
        );
    }
}

export default Registration;