import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ModelDetailsModal from "../../Models/Actions/ModelDetailsModal";
import "../../Home.css";
import Swal from "sweetalert2";
import UsersRemote from "../../Users/flux/UsersRemote";
import ModelsRemote from "../../Models/flux/ModelsRemote";
import Routes from "../../Constants/Routes";
import {Navigate} from 'react-router-dom';


class BasinDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            basin: props.basin,
            modelList: props.models,
            totalCount: props.totalCount,
            sessionPresent: false,
            showModelDetailsModal: false,
            selectedModel: null,
            permissionsList: null,
            sessionUserId: null,
            navigateToCalibration: false,
            navigateToOptimization: false
        }
    }

    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            let sessionObject = JSON.parse(session);

            let User_Id = sessionObject.sessionUserId;
            this.setState({ sessionUserId: User_Id});
            let Model_Id_List = [];
            this.state.modelList.forEach(model => Model_Id_List.push(model.id));

            let payload = {
                User_Id: User_Id,
                Model_Id_List: JSON.stringify(Model_Id_List)
            }
            UsersRemote.checkUserPermissionsForModels(payload).then(response => {
                if (response.status === 500) {
                    Swal.fire({
                        title: "Error",
                        text: "An error occured while checking permissions.",
                        icon: "error"
                    });
                }
                else if (response.ok) {
                    response.json().then(data => this.setState({ permissionsList: data }));
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.permissionsList === null && this.state.permissionsList !== null){
            this.render();
        }
    }

    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss());
    }

    getModalHeader = () => {
        return <ModalHeader>
            Basin Details
        </ModalHeader>
    }

    getModalBody = () => {
        const basin = this.state.basin;
        const models = this.state.modelList;

        return <ModalBody>
            <div className={"title-basin"}><h4>{basin.basinName}</h4></div>
            <div className={"model-info-container"}>
                <div><span>Flow Station No: </span>{basin.flowStationNo}</div>
                <div><span>Area Field (km2): </span>{basin.field}</div>
                <div><span>Description: </span>{basin.description}</div>
                <div><span>Total Created Simulations: </span>{this.state.totalCount}</div>
            </div>
            <div className={"title-basin-models"}><h5>Simulation List</h5></div>
            <div className={"model-list-container col-12"}>
                {
                    models.length === 0 ? <span> No Simulation Found for This Basin </span> : models.map((model, idx) => {
                        return (
                            <div key={`basinModelNo${idx}`} className={"button-group col-8"}>
                                <div>
                                    <span>Name: </span>{model.name}
                                </div>
                                <div className={"model-action-btn-container col-4"}>
                                    <button type="button" className="btn btn-success" disabled={this.isPermittedDetails(model.id)}
                                        onClick={() => this.toggleShowModelDetails(model)}>Details</button>
                                    <button type="button" className="btn btn-primary" disabled={this.isPermittedSimulation(model.id)}
                                        onClick={() => this.navigateToCalibration(model.id)}>Calibrate</button>
                                    <button type="button" className="btn btn-warning" disabled={this.isPermittedSimulation(model.id)}
                                            onClick={() => this.navigateToOptimization(model.id)}>Optimize</button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-secondary"
                    onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    isPermittedDetails = (myModelId) => {
        let givenPermission = null;
        if(this.state.permissionsList) {
            this.state.permissionsList.forEach(permission => {
                if (!givenPermission && permission.modelId === myModelId && permission.permData === true) {
                    givenPermission = permission;
                }
            });
        }
        return givenPermission == null;
    }

    isPermittedSimulation = (myModelId) => {
        let givenPermission = null;
        if(this.state.permissionsList) {
            this.state.permissionsList.forEach(permission => {
                if (!givenPermission && permission.modelId === myModelId && permission.permSimulation === true) {
                    givenPermission = permission;
                }
            });
        }
        return givenPermission == null;
    }

    navigateToCalibration = (modelId) => {
        let payload = {
            User_Id: this.state.sessionUserId,
            Model_Id: modelId
        }

        ModelsRemote.checkModelsOfUser(payload).then(response => {
            if (response.status === 302) {
                this.setState({ navigateToCalibration: true });
            }
        });
    }

    navigateToOptimization = (modelId) => {
        let payload = {
            User_Id: this.state.sessionUserId,
            Model_Id: modelId
        }
        ModelsRemote.checkModelsOfUser(payload).then(response => {
            if (response.status === 302) {
                this.setState({ navigateToOptimization: true });
            }
        });
    }

    toggleShowModelDetails = (model) => {
        this.setState({ 
            showModelDetailsModal: !this.state.showModelDetailsModal,
            selectedModel: model
        });
    }

    render() {
        return (
            <>
                { this.state.navigateToCalibration && <Navigate to={Routes.CalibrationPage.route}/> }
                { this.state.navigateToOptimization && <Navigate to={Routes.OptimizationPage.route}/> }

                <Modal isOpen={this.state.showModal}>
                    {this.getModalHeader()}
                    {this.getModalBody()}
                    {this.getModalFooter()}
                </Modal>

                {
                    this.state.showModelDetailsModal && <ModelDetailsModal
                        showModal={this.state.showModelDetailsModal}
                        onDismiss={() => this.toggleShowModelDetails(null)}
                        model={this.state.selectedModel}
                    />
                }
            </>
        );
    }
}

export default BasinDetailsModal;