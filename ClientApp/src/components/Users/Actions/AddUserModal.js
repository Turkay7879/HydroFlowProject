import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import UsersRemote from "../flux/UsersRemote";
import AddUserForm from "./AddUserForm";

class AddUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            user: {
                Name: "",
                Surname: "",
                CorporationName: "",
                Email: "",
                Password: ""
            },
            formInvalidFields: {
                nameInvalid: false,
                surnameInvalid: false,
                corporationNameInvalid: false,
                emailInvalid: false,
                passwordInvalid: false
            }
        };
    }

    //the selected user is saved in the state
    componentDidMount() {
        this.setState({ showModal: this.props.showModal });
        if (this.props.selectedUser !== null && this.props.selectedUser !== undefined) {
            let selectedUser = this.props.selectedUser;
            selectedUser.Password = "";
            this.setState({ user: selectedUser });
        }
    }

    //returns header component of modal
    getModalHeader = () => {
        return <ModalHeader>
            Add User
        </ModalHeader>
    }

    //returns add user form in body of modal component
    getModalBody = () => {
        return <ModalBody>
            <AddUserForm setUser={(property, value) => {
                let newUser = this.state.user;
                newUser[property] = value
                this.setState({ user: newUser });
            }} selectedUser={this.state.user} {...this.state.formInvalidFields} />
        </ModalBody>
    }

    //returns footer component of model
    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-primary"
                onClick={this.checkUser}>Save User</button>
            <button type="button" className="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    //modal is closed
    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss());
    }

    //checks if user information has been entered incorrectly
    checkUser = () => {
        let user = this.state.user;
        let newInvalidFields = this.state.formInvalidFields;

        let trimmedName = user.Name.trim();
        user.Name = trimmedName;
        newInvalidFields.nameInvalid = trimmedName === "";

        let trimmedSurname = user.Surname.trim();
        user.Surname = trimmedSurname;
        newInvalidFields.surnameInvalid = trimmedSurname === "";

        let trimmedCorpName = user.CorporationName.trim();
        user.CorporationName = trimmedCorpName;
        newInvalidFields.corporationNameInvalid = trimmedCorpName === "";

        let trimmedEmail = user.Email.trim();
        user.Email = trimmedEmail;
        newInvalidFields.emailInvalid = trimmedEmail === "";

        let password = user.Password;
        newInvalidFields.passwordInvalid = password === "";

        if (newInvalidFields.nameInvalid || newInvalidFields.surnameInvalid ||
            newInvalidFields.corporationNameInvalid || newInvalidFields.emailInvalid ||
            newInvalidFields.passwordInvalid) {
            this.setState({ formInvalidFields: newInvalidFields });
            return Swal.fire({
                title: "Incorrect Form Fields",
                text: "Please fill the required fields correctly to save new user!",
                icon: "warning"
            });
        }
        if (!user.Id) { user.Id = -1; }
        this.saveUser(user);
    }

    //user information is saved
    saveUser = (user) => {
        UsersRemote.saveUser(user).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    Swal.fire({
                        title: !this.props.selectedUser ? "Added User" : "Saved User",
                        text: `${!this.props.selectedUser ? "Added" : "Saved"} ${data.Name} successfully!`,
                        icon: "success"
                    }).then(() => {
                        this.props.onSave()
                        this.dismissModal()
                    });
                });
            } else {
                Swal.fire({
                    title: "Save Failed",
                    text: "An error occured while saving user!",
                    icon: "error"
                });
            }
        });
    }

    //displays the add user modal
    render() {
        return <>
            <Modal isOpen={this.state.showModal}>
                {this.getModalHeader()}
                {this.getModalBody()}
                {this.getModalFooter()}
            </Modal>
        </>
    }
}

export default AddUserModal;