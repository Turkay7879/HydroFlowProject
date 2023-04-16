import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import "../styles/Login.css";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null
        }
    }
    
    login = () => {
        console.log(`Email: ${this.state.email}\tPassword: ${this.state.password}`);
    }
    
    render() {
        return (
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
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </div>
                <div className={"loginButton"}>
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={this.login}>
                            Login
                    </button>
                </div>
          </>  
        );
    }
}

export default Login;