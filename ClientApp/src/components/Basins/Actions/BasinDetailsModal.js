import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../../Home.css";

class BasinDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            basin: props.basin,
            modelList: props.models,
            sessionPresent: false
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
            <div className={"title-basin-models"}><h5>Model List</h5></div>
            <div className={"model-list-container"}>
                {
                    models.length === 0 ? <span> No Model Found for This Basin </span> : models.map((model, idx) => {
                        return (
                            <div key={`basinModelNo${idx}`} className={"model-list-item"}>
                                <div>
                                    <span>Name: </span>{model.name}
                                </div>
                                <div className={"model-action-btn-container"}>
                                    <button type="button" className="btn btn-success" disabled={!this.state.sessionPresent}
                                        onClick={this.showModelDetails}>Details</button>
                                    <button type="button" className="btn btn-primary" disabled={!this.state.sessionPresent}
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

    showModelDetails = () => {

    }

    render() {
        return (
            <>
                <Modal isOpen={this.state.showModal}>
                    {this.getModalHeader()}
                    {this.getModalBody()}
                    {this.getModalFooter()}
                </Modal>
            </>
        );
    }
}

export default BasinDetailsModal;