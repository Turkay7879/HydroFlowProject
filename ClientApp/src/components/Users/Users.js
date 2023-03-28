import React from "react";
import UsersRemote from "./flux/UsersRemote";
import AddUserModal from "./Actions/AddUserModal";
import Swal from "sweetalert2";

class Users extends React.Component {
    tableColumns = ["Name", "Surname", "Corporation Name", "Email", "Password", "Actions"];

    constructor(props) {
        super(props);
        this.state = {
            loadingUsers: true,
            users: null,
            showAddUserModal: false,
            savedUser: false,
            selectedUser: null,
            editingUser: false
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    componentDidUpdate() {
        if (this.state.savedUser) {
            this.refreshData();
            this.setState({ savedUser: false });
        }
    }

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

    toggleAddUserModal = () => {
        this.setState({
            savedUser: false,
            showAddUserModal: !this.state.showAddUserModal
        });
    }

    toggleEditUserModal = () => {
        this.setState({ editingUser: !this.state.editingUser });
    }

    onSaveUser = () => {
        this.setState({ savedUser: true }, () => {
            this.refreshData()
        })
    }

    editUser = (user) => {
        this.setState({ selectedUser: user }, () => {
            console.log(this.state.selectedUser);
            this.toggleEditUserModal();
        });
    }

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
                            <td>{user.Name}</td>
                            <td>{user.Surname}</td>
                            <td>{user.CorporationName}</td>
                            <td>{user.Email}</td>
                            <td>{user.Password}</td>
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
        return <>
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
