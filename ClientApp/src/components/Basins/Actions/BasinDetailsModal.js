import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ModelDetailsModal from "../../Models/Actions/ModelDetailsModal";
import "../../Home.css";

class BasinDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            basin: props.basin,
            modelList: props.models,
            sessionPresent: false,
            showModelDetailsModal: false,
            selectedModel: null
        }
    }

    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        //this.setState({ sessionPresent: session !== null && session !== undefined });
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
            </div>
            <div className={"title-basin-models"}><h5>Simulation List</h5></div>
            <div className={"model-list-container"}>
                {
                    models.length === 0 ? <span> No Simulation Found for This Basin </span> : models.map((model, idx) => {
                        return (
                            <div key={`basinModelNo${idx}`} className={"model-list-item"}>
                                <div>
                                    <span>Name: </span>{model.name}
                                </div>
                                <div className={"model-action-btn-container"}>
                                    <button type="button" className="btn btn-success" disabled={false}
                                        onClick={() => this.toggleShowModelDetails(model)}>Details</button>
                                    <button type="button" className="btn btn-primary" disabled={!this.state.validSessionPresent}
                                        onClick={this.navigateToCalibration}>Calibrate</button>
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

    navigateToCalibration = () => {

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