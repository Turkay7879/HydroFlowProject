import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import BasinsRemote from "../flux/BasinsRemote";
import AddBasinForm from "./AddBasinForm";

class AddBasinModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            basin: {
                basinName: "",
                flowStationNo: "",
                flowObservationStationLat: null,
                flowObservationStationLong: null,
                field: null,
                description: ""
            },
            formInvalidFields: {
                basinNameInvalid: false,
                flowStationNoInvalid: false,
                flowStationLatInvalid: false,
                flowStationLongInvalid: false,
                fieldInvalid: false
            }
        };
    }

    componentDidMount() {
        if (this.props.selectedBasin !== null && this.props.selectedBasin !== undefined) {
            this.setState({basin: this.props.selectedBasin}, () => {
                this.setState({showModal: this.props.showModal});
            });
        } else {
            this.setState({showModal: this.props.showModal});
        }
    }

    getModalHeader = () => {
        return <ModalHeader>
            Add Basin
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <AddBasinForm setBasin={(property, value) => {
                    let newBasin = this.state.basin;
                    newBasin[property] = value
                    this.setState({ basin: newBasin });
                }} selectedBasin={this.state.basin} {...this.state.formInvalidFields}/>
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" class="btn btn-primary"
                onClick={this.checkBasin}>Save Basin</button>
            <button type="button" class="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    dismissModal = () => {
        this.setState({showModal: false}, () => this.props.onDismiss());
    }

    checkBasin = () => {
        let basin = this.state.basin;
        let newInvalidFields = this.state.formInvalidFields;

        let trimmedName = basin.basinName.trim();
        basin.basinName = trimmedName;
        newInvalidFields.basinNameInvalid = trimmedName === "";
        
        let trimmedFlowStationNo = basin.flowStationNo.trim();
        basin.flowStationNo = trimmedFlowStationNo;
        newInvalidFields.flowStationNoInvalid = trimmedFlowStationNo === "";

        basin.description = basin.description.trim();
        
        if (!basin.field) {
            newInvalidFields.fieldInvalid = true;
        } else {
            let parsedField = parseInt(basin.field);
            if (parsedField === NaN) {newInvalidFields.fieldInvalid = true}
            else {
                basin.field = parsedField;
                newInvalidFields.fieldInvalid = false;
            }
        }

        if (!basin.flowObservationStationLat) {
            newInvalidFields.flowStationLatInvalid = true;
        } else {
            let parsedLatitude = parseFloat(basin.flowObservationStationLat);
            if (parsedLatitude === NaN) {newInvalidFields.flowStationLatInvalid = true;}
            else {
                newInvalidFields.flowStationLatInvalid = false;
                basin.flowObservationStationLat = parsedLatitude;
            }
        }

        if (!basin.flowObservationStationLong) {
            newInvalidFields.flowStationLongInvalid = true;
        } else {
            let parsedLongitude = parseFloat(basin.field);
            if (parsedLongitude === NaN) {newInvalidFields.flowStationLongInvalid = true;}
            else {
                basin.field = parsedLongitude;
                newInvalidFields.flowStationLongInvalid = false;
            }
        }

        if (newInvalidFields.basinNameInvalid || newInvalidFields.fieldInvalid ||
            newInvalidFields.flowStationLatInvalid || newInvalidFields.flowStationLongInvalid ||
            newInvalidFields.flowStationNoInvalid) {
                this.setState({formInvalidFields: newInvalidFields});
                return Swal.fire({
                    title: "Incorrect Form Fields",
                    text: "Please fill the required fields correctly to save new basin!",
                    icon: "warning"
                });
            }

        this.saveBasin(basin);
    }

    saveBasin = (basin) => {
        BasinsRemote.saveBasin(basin).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    Swal.fire({
                        title: !this.props.selectedBasin ? "Added Basin" : "Saved Basin",
                        text: `${!this.props.selectedBasin ? "Added" : "Saved"} ${data.basinName} successfully!`,
                        icon: "success"
                    }).then(() => {
                        if (this.props.onSave !== null && this.props.onSave !== undefined) {
                            this.props.onSave();
                        }
                        this.dismissModal();
                    });
                });
            } else {
                Swal.fire({
                    title: "Save Failed",
                    text: "An error occured while saving basin!",
                    icon: "error"
                });
            }
        }); 
    }

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

export default AddBasinModal;