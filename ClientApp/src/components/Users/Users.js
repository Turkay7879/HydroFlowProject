import React from "react";
import UsersRemote from "./flux/UsersRemote";
import AddUserModal from "./Actions/AddUserModal";
import Swal from "sweetalert2";
import SessionsRemote from "../Constants/flux/remote/SessionsRemote";
import {Navigate} from "react-router-dom";
import NotAllowedPage from "../Common/NotAllowedPage";

class Users extends React.Component {
    tableColumns = ["Id", "Name", "Surname", "Corporation Name", "Email", "Password", "Actions"];

    constructor(props) {
        super(props);
        this.state = {
            loadingUsers: true,
            users: null,
            showAddUserModal: false,
            savedUser: false,
            selectedUser: null,
            editingUser: false,
            validSessionPresent: false,
            authorizedToView: false,
            loadingPage: true
        };
    }

    //session status is checked
    componentDidMount() {
        this.checkPermissions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //fetches updated user information if new user is registered
        if (this.state.savedUser) {
            this.refreshData();
            this.setState({ savedUser: false });
        }
        //fetches user information if current state is active
        if (!prevState.validSessionPresent && !prevState.authorizedToView &&
            this.state.validSessionPresent && this.state.authorizedToView) {
            this.refreshData();
        }
    }

    //checks the validity of the user's session
    checkPermissions = () => {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            //request for session validate
            SessionsRemote.validateSession(session, (status) => {
                //current session is valid
                if (status) {
                    this.setState({ validSessionPresent: true }, () => {
                        let sessionData = JSON.parse(session);
                        this.setState({
                            //admin authority is checked
                            authorizedToView: sessionData && sessionData.allowedRole && sessionData.allowedRole === "sysadmin",
                            loadingPage: false
                        }, () => this.refreshData())
                    });
                }
                //session is expired
                else {
                    window.localStorage.removeItem("hydroFlowSession");
                    SessionsRemote.logoutUser(session).then(response => {
                        Swal.fire({
                            title: "Session Expired",
                            text: `Your session has expired. Login required for this page.`,
                            icon: "warning"
                        }).then(() => {
                            this.setState({
                                loadingPage: false,
                                validSessionPresent: false
                            });
                        });
                    });
                }
            });
        }
        //no valid session
        else {
            this.setState({ 
                loadingPage: false,
                validSessionPresent: false
            });
        }
    }

    //request returns all user informations in json format
    refreshData = async () => {
        UsersRemote.getAllUsers()
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({
                            loadingUsers: false,
                            users: data,
                            selectedUser: null
                        });
                    });
                } else {
                    this.setState({ loadingUsers: false });
                }
                this.setState({ savedUser: false });
            });
    }

    //updates the prop holding the visibility state of the addUserModal
    toggleAddUserModal = () => {
        this.setState({
            savedUser: false,
            showAddUserModal: !this.state.showAddUserModal
        });
    }

    //updates the prop that holds whether the user information exists in edit mode
    toggleEditUserModal = () => {
        this.setState({ editingUser: !this.state.editingUser });
    }

    //updates user list and savedUser prop when user is saved
    onSaveUser = () => {
        this.setState({ savedUser: true }, () => {
            this.refreshData()
        })
    }

    //called to edit the selected user
    editUser = (user) => {
        this.setState({ selectedUser: user }, () => {
            this.toggleEditUserModal();
        });
    }

    //called to unregister the selected user
    deleteUser = (user) => {
        console.log(`Delete User ${user.Id}`)
        Swal.fire({
            title: 'Confirm Deletion',
            text: `Continue deleting selected user?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                UsersRemote.deleteUser(user).then(response => {
                    if (response.status === 412) {
                        return response.json().then(errMsg => {
                            Swal.fire({
                                title: "Error",
                                text: errMsg,
                                icon: "error"
                            });
                        });
                    }
                    Swal.fire({
                        title: "Deleted User",
                        text: `Deleted ${user.Name} successfully!`,
                        icon: "success"
                    }).then(() => this.refreshData());
                }).catch(err => {
                    Swal.fire({
                        title: "Error Deleting User",
                        text: err,
                        icon: "error"
                    });
                });
            }
        });

    }

    getBody() {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        {this.tableColumns.map(col => <th key={col}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map(user =>
                        <tr key={user.Id}>
                            <td>{user.Id}</td>
                            <td>{user.Name}</td>
                            <td>{user.Surname}</td>
                            <td>{user.CorporationName}</td>
                            <td>{user.Email}</td>
                            <td>******</td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        onClick={(e) => { this.editUser(user) }}>Edit</button>
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        onClick={(e) => { this.deleteUser(user) }}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        //displays the page after session and authorization check
        return this.state.loadingPage ? <></>
            : !this.state.validSessionPresent ? <Navigate to={"/login"}/>
                : !this.state.authorizedToView ? <NotAllowedPage/> : <>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <button type="button" className="btn btn-primary"
                    onClick={() => { this.toggleAddUserModal() }}>
                    Add User
                </button>
            </div>
            {
                this.state.loadingUsers ? <p className="fs-1">Loading Users...</p> :
                    !this.state.users ? <p className="fs-1">No User Found!</p> :
                        this.getBody()
            }
            {
                this.state.showAddUserModal && <AddUserModal
                    showModal={this.state.showAddUserModal}
                    onDismiss={this.toggleAddUserModal}
                    onSave={this.onSaveUser}
                />
            }
            {
                this.state.editingUser && <AddUserModal
                    showModal={this.state.editingUser}
                    onDismiss={this.toggleEditUserModal}
                    onSave={this.onSaveUser}
                    selectedUser={this.state.selectedUser}
                />
            }
        </>;
    }
}

export default Users;
