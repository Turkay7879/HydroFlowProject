import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

class AddUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedUser: null,
            nameInvalid: this.props.nameInvalid,
            surnameInvalid: this.props.surnameInvalid,
            corporationNameInvalid: this.props.corporationNameInvalid,
            emailInvalid: this.props.emailInvalid,
            passwordInvalid: this.props.passwordInvalid
        };
    }

    componentDidMount() {
        if (this.props.selectedUser) {
            this.setState({ selectedUser: this.props.selectedUser }, () => {
                this.setState({ loading: false });
            });
        } else { this.setState({ loading: false }); }
    }

    componentDidUpdate() {
        if (this.state.nameInvalid !== this.props.nameInvalid) {
            this.setState({ nameInvalid: this.props.nameInvalid });
        }
        if (this.state.surnameInvalid !== this.props.surnameInvalid) {
            this.setState({ surnameInvalid: this.props.surnameInvalid });
        }
        if (this.state.corporationNameInvalid !== this.props.corporationNameInvalid) {
            this.setState({ corporationNameInvalid: this.props.corporationNameInvalid });
        }
        if (this.state.emailInvalid !== this.props.emailInvalid) {
            this.setState({ emailInvalid: this.props.flowStationLongInvalid });
        }
        if (this.state.passwordInvalid !== this.props.passwordInvalid) {
            this.setState({ passwordInvalid: this.props.passwordInvalid });
        }
    }

    render() {
        return <>
            {!this.state.loading && <Form>
                <FormGroup>
                    <Label for="addUserFormName">Name</Label>
                    <Input
                        id="addUserFormName"
                        name="Name"
                        type="text"
                        invalid={this.state.nameInvalid}
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.Name : ""}
                        onChange={(e) => this.props.setUser('Name', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addUserFormSurname">Surname</Label>
                    <Input
                        id="addUserFormSurname"
                        name="Surname"
                        type="text"
                        invalid={this.state.surnameInvalid}
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.Surname : ""}
                        onChange={(e) => this.props.setUser('Surname', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addUserFormCorporationName">Corporation Name</Label>
                    <Input
                        id="addUserCorporationName"
                        name="CorporationName"
                        type="text"
                        invalid={this.state.corporationNameInvalid}
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.CorporationName : ""}
                        onChange={(e) => this.props.setUser('CorporationName', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addUserFormEmail">Email</Label>
                    <Input
                        id="addUserFormEmail"
                        name="Email"
                        type="text"
                        invalid={this.state.emailInvalid}
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.Email : ""}
                        onChange={(e) => this.props.setUser('Email', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addUserFormPassword">Password</Label>
                    <Input
                        id="addUserFormPassword"
                        name="Password"
                        type="text"
                        invalid={this.state.passwordInvalid}
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.Password : ""}
                        onChange={(e) => this.props.setUser('Password', e.target.value)}
                    />
                </FormGroup>
            </Form>}
        </>
    }
}

export default AddUserForm;