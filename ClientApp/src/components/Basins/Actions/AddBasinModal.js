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
                BasinName: "",
                FlowStationNo: "",
                FlowObservationStationLat: null,
                FlowObservationStationLong: null,
                Field: null,
                Description: ""
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
        this.setState({showModal: this.props.showModal});
        if (this.props.selectedBasin !== null && this.props.selectedBasin !== undefined) {
            this.setState({basin: this.props.selectedBasin});
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

        let trimmedName = basin.BasinName.trim();
        basin.BasinName = trimmedName;
        newInvalidFields.basinNameInvalid = trimmedName === "";
        
        let trimmedFlowStationNo = basin.FlowStationNo.trim();
        basin.FlowStationNo = trimmedFlowStationNo;
        newInvalidFields.flowStationNoInvalid = trimmedFlowStationNo === "";

        basin.Description = basin.Description.trim();
        
        if (!basin.Field) {
            newInvalidFields.fieldInvalid = true;
        } else {
            let parsedField = parseInt(basin.Field);
            if (parsedField === NaN) {newInvalidFields.fieldInvalid = true}
            else {
                basin.Field = parsedField;
                newInvalidFields.fieldInvalid = false;
            }
        }

        if (!basin.FlowObservationStationLat) {
            newInvalidFields.flowStationLatInvalid = true;
        } else {
            let parsedLatitude = parseFloat(basin.FlowObservationStationLat);
            if (parsedLatitude === NaN) {newInvalidFields.flowStationLatInvalid = true;}
            else {
                newInvalidFields.flowStationLatInvalid = false;
                basin.FlowObservationStationLat = parsedLatitude;
            }
        }

        if (!basin.FlowObservationStationLong) {
            newInvalidFields.flowStationLongInvalid = true;
        } else {
            let parsedLongitude = parseFloat(basin.Field);
            if (parsedLongitude === NaN) {newInvalidFields.flowStationLongInvalid = true;}
            else {
                basin.Field = parsedLongitude;
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
                    }).then(() => this.dismissModal());
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