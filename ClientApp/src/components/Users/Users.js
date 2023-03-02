import React from "react";
import UsersRemote from "./flux/UsersRemote";

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingUsers: true,
            users: null,
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    async refreshData() {
        UsersRemote.getAllUsers()
            .then((response) => {
                response.json().then(data => {
                    this.setState({ loadingUsers: false, users: data });
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loadingUsers: false });
            });
    }

    editUser(user) {
        console.log(`Edit User ${user.Id}`)
    }

    deleteUser(user) {
        console.log(`Delete User ${user.Id}`)
    }

    getBody() {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Corporation Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
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
            {
                this.state.loadingUsers ? <p class="fs-1">Loading Users...</p> :
                    !this.state.users ? <p class="fs-1">Error Loading Users!</p> :
                        this.getBody()
            }
        </>;
    }
}

export default Users;
