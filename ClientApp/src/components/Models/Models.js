import React, { Component } from 'react';
import ModelsRemote from "./flux/ModelsRemote";
import "./Models.css";
import Swal from "sweetalert2";
import AddModelModal from "./Actions/AddModelModal";
import { Buffer } from 'buffer';
import SessionsRemote from "../Constants/flux/remote/SessionsRemote";
import {Navigate} from "react-router-dom";
import NotAllowedPage from "../Common/NotAllowedPage";

class Models extends Component {
    constructor(props) {
        super(props);
  // State variables
        this.state = {
            loadingModels: true,
            models: [],
            showAddModelModal: false,
            savedModel: false,
            selectedModel: null,
            editingModel: false,
            validSessionPresent: false,
            authorizedToView: false,
            loadingPage: true
        };
          // Table columns
        this.tableColumns = ['Name', 'Title', 'Create Date', 'Observation Data File', 'Simulation Permission'];
    }
        // Check permissions when component is mounted
    componentDidMount() {
        this.checkPermissions();
    }
       // Refresh data when a new or edited model is saved, or when the user's session or authorization status changes
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.savedModel) {
            this.refreshData();
            this.setState({ savedModel: false });
        }
        if (!prevState.validSessionPresent && !prevState.authorizedToView &&
            this.state.validSessionPresent && this.state.authorizedToView) {
            this.refreshData();
        }
    }
      // Check whether a valid session exists for the user and whether the user is authorized to view the component
    checkPermissions = () => {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            SessionsRemote.validateSession(session, (status) => {
                if (status) {
                      // Load data if user has valid session and is authorized to view
                    this.setState({ validSessionPresent: true }, () => {
                        let sessionData = JSON.parse(session);
                        this.setState({
                            authorizedToView: sessionData && sessionData.allowedRole && sessionData.allowedRole === "sysadmin",
                            loadingPage: false
                        }, () => this.refreshData())
                    });
                } else {
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
        } else {
            this.setState({ 
                loadingPage: false,
                validSessionPresent: false
            });
        }
    }
        // Retrieve all models from server
    refreshData = async () => {
        ModelsRemote.getAllModels()
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({ loadingModels: false, models: data, selectedModel: null });
                    });
                } else {
                    this.setState({ loadingModels: false, models: null, selectedModel: null });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loadingModels: false });
            });
    }
        // Toggle display of "Add Model" modal
    toggleAddModelModal = () => {
        this.setState({
            savedModel: false,
            showAddModelModal: !this.state.showAddModelModal
        });
    }
        // Toggle display of "Add Model" modal in edit mode
    toggleEditModelModal = () => {
        this.setState({ editingModel: !this.state.editingModel });

    }
        // Set savedModel state variable to true
    onSaveModel = () => {
        this.setState({ savedModel: true })
    }
     // Set selectedModel state variable to specified model and toggle display of "Add Model" modal in edit mode
    editModel = (model) => {
        this.setState({ selectedModel: model }, () => {
            this.toggleEditModelModal();
        });
    }
    // Display confirmation dialog and delete model if user confirms deletion
    deleteModel = (id) => {
        Swal.fire({
            title: 'Confirm Deletion',
            text: `Are you sure to delete this simulation and related data? If there are any permitted user(s) exist for this simulation, they also will lose their access!`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                ModelsRemote.deleteModel(id).then(response => response.json().then(model => {
                    Swal.fire({
                        title: "Success",
                        text: "Deleted simulation successfully!",
                        icon: "success"
                    }).then(() => {
                        // Remove the deleted model from the models array in the state
                        const models = this.state.models.filter(m => m.Id !== model.Id);
                        this.setState({ models });
                        this.refreshData();
                    });
                })).catch(err => {
                    Swal.fire({
                        title: "Error Deleting Simulation",
                        text: err,
                        icon: "error"
                    });
                });
            }
        });
    }
        // Download observation data for specified model
    downloadModelData = (id) => {
        ModelsRemote.downloadModelData(id).then(response => response.json().then(model => {
            let data = model.modelFile;
            console.log(data)
            const bytes = Buffer.from(data, 'base64')
            const blob = new Blob([bytes])
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "data.xlsx";
            link.click();
            link.remove();
        }))
    }
        // Return table body for displaying simulation models
    getBody() {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        {this.tableColumns.map(col => <th key={col}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.models.map(model =>
                        <tr key={model.Id}>
                            <td>{model.Name}</td>
                            <td>{model.Title}</td>
                            <td>{new Date(model.CreateDate).toLocaleString()}</td>

                            <td>
                                <button 
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => this.downloadModelData(model.Id)}>
                                        Download Observation Data
                                    </button>
                            </td>
                            <td>{model.ModelPermissionId === 1 ? 'Private' : 'Public'}</td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <button type="button" className="btn btn-primary"
                                        onClick={(e) => { this.editModel(model) }}>Edit</button>
                                    <button type="button" className="btn btn-danger"
                                        onClick={(e) => { this.deleteModel(model.Id) }}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
        // Return JSX for displaying component
    render() {
              // Display loading message
        return this.state.loadingPage ? <></>
            : !this.state.validSessionPresent ? <Navigate to={"/login"}/>
                : !this.state.authorizedToView ? <NotAllowedPage/> : <>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <button type="button" className="btn btn-primary"
                    onClick={() => { this.toggleAddModelModal() }}>
                    Create Simulation
                </button>
            </div>
            {
                this.state.loadingModels ? <p className="fs-1">Loading Simulations...</p> :
                    !this.state.models ? <p className="fs-1">No Simulation Found</p> :
                        this.getBody()
            }
            {
                this.state.showAddModelModal && <AddModelModal
                    showModal={this.state.showAddModelModal}
                    onDismiss={this.toggleAddModelModal}
                    onSave={this.onSaveModel}
                />
            }
            {
                this.state.editingModel && <AddModelModal
                    showModal={this.state.editingModel}
                    onDismiss={this.toggleEditModelModal}
                    onSave={this.onSaveModel}
                    selectedModel={this.state.selectedModel}
                />
            }
        </>;
    }
}


export default Models; 