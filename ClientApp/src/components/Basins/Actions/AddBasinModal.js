import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import BasinsRemote from "../flux/BasinsRemote";

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
            }
        };
    }

    componentDidMount() {
        this.setState({showModal: this.props.showModal});
    }

    getModalHeader = () => {
        return <ModalHeader>
            Add Basin
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            ...
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
        if (!basin || basin.BasinName.trim() === "" || !basin.Field || !basin.FlowObservationStationLat
        || !basin.FlowObservationStationLong || basin.FlowStationNo.trim() === "") {
            return Swal.fire({
                title: "Missing Form Fields",
                text: "Please fill the required fields to save new basin!",
                icon: "warning"
            });
        }
        this.saveBasin(basin);
    }

    saveBasin = (basin) => {
        // let testBasin = {
        //     BasinName: "Basin 6",
        //     FlowStationNo: "B0006",
        //     FlowObservationStationLat: 1.1,
        //     FlowObservationStationLong: 1.3,
        //     Field: 0,
        //     Description: "Test Description 3"
        // };

        BasinsRemote.saveBasin(basin).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    Swal.fire({
                        title: "Added Basin",
                        text: `Added ${data.basinName} successfully!`,
                        icon: "success"
                    }).then(() => this.dismissModal());
                });
            } else {
                Swal.fire({
                    title: "Save Failed",
                    text: "An error occured while saving new basin!",
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