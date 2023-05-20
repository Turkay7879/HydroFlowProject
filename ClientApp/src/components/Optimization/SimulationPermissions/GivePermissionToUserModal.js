import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import UsersRemote from '../../Users/flux/UsersRemote';
import GivePermissionToUserForm from './GivePermissionToUserForm';

class GivePermissionToUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            permissions: {
                ModelId: 0,
                UserId: 0,
                PermittedUserMail: '',
                PermData: false,
                PermDownload: false,
                PermSimulation: false,
                currentUserMail: ''
            },
            selectedModel: props.selectedModel
        };
    }

    componentDidMount() {
        this.setState({ 
            showModal: this.props.showModal,
            permissions: this.props.permissions ? this.props.permissions : this.state.permissions
        });
    }

    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss())
    }

    savePermissions = () => {
        let session = JSON.parse(window.localStorage.getItem("hydroFlowSession"));

        let modelId = this.state.selectedModel.id;
        let userId = session.sessionUserId;

        let payload = {
            ...this.state.permissions,
            ModelId: modelId,
            UserId: userId
        };

        let findUser = {
            UserId: userId
        }

        UsersRemote.getUserById(findUser).then(response => {
            if (response.status === 404) {
                Swal.fire({
                    title: "Error",
                    text: "User is not registered.",
                    icon: "error"
                });
            }
            else if (response.ok) {
                response.json().then(data => {this.setState({ currentUserMail: data.Email })
                    if (data === payload.permittedUserMail) {
                        Swal.fire({
                            title: 'Permissions Error',
                            text: 'You can\'t give permission yourself.',
                            icon: 'error'
                        });
                    }else{
                        Swal.fire({
                            title: 'Are you sure to give permission?',
                            text: `You are about to give the selected permissions to \'${payload.PermittedUserMail}\'. Do you want to continue?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Give Permissions'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                UsersRemote.givePermissionsToUser(payload).then(response => {
                                    if (response.status === 404) {
                                        Swal.fire({
                                            title: 'Couldn\'t Give Permission',
                                            text: 'Please check the user mail you are giving permission to.',
                                            icon: 'error'
                                        });
                                    } else if (response.status === 400) {
                                        Swal.fire({
                                            title: 'Permissions Error',
                                            text: 'You need to give at least one permission to the user you have provided.',
                                            icon: 'error'
                                        });
                                    } else if (response.status === 500) {
                                        Swal.fire({
                                            title: 'Permission Save Error',
                                            text: 'An error occured during saving permissions. Try again later.',
                                            icon: 'error'
                                        });
                                    } else if (response.ok) {
                                        Swal.fire({
                                            title: 'Saved Permissions Successfully',
                                            text: 'You have successfully gave the selected permissions to the specified user.',
                                            icon: 'success'
                                        }).then(() => this.dismissModal());
                                    }
                                });
                            }
                        });
                    }

                });

            }
        });
    }

    changePermission = (permissionType, newValue) => {
        let currentPermissions = this.state.permissions;
        currentPermissions[permissionType] = newValue;
        this.setState({ permissions: currentPermissions });
    }

    getModalHeader = () => {
        return <ModalHeader>
            Give Permission to a User
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <GivePermissionToUserForm
                permissions={this.state.permissions}
                onChangePermission={(permissionType, newValue) => this.changePermission(permissionType, newValue)}
            />
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-primary"
                onClick={this.savePermissions}>Give Permissions</button>
            <button type="button" className="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    render() {
        return (
            <Modal isOpen={this.state.showModal}>
                {this.getModalHeader()}
                {this.getModalBody()}
                {this.getModalFooter()}
            </Modal>
        );
    }
}

export default GivePermissionToUserModal;