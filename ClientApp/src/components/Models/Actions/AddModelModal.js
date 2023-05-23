import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import ModelsRemote from "../flux/ModelsRemote";
import BasinsRemote from "../../Basins/flux/BasinsRemote";
import AddModelForm from "./AddModelForm";

class AddModelModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            model: {
                Name: "",
                Title: "",
                CreateDate: null,
                ModelFile: null,
                ModelPermissionId: 0,
                Training_Percentage: 80,
                BasinId: 0
            },
            formInvalidFields: {
                NameInvalid: false,
                titleInvalid: false,
                modelFileInvalid: false,
                basinInvalid: false
            },
            availableBasins: null
        };
    }



    componentDidMount() {
        if (this.props.selectedModel !== null && this.props.selectedModel !== undefined) {
            this.setState({ model: this.props.selectedModel }, () => {
                this.setState({ showModal: this.props.showModal }, () => this.getBasinList());
            });
        } else {
            this.setState({ showModal: this.props.showModal }, () => this.getBasinList());
        }
    }

    getBasinList = () => {
        BasinsRemote.getAllBasins().then(response => {
            if (response.status === 404) {
                // Ask to add a basin first
            } else {
                response.json().then(basinList => {
                    this.setState({ availableBasins: basinList });
                })
            }
        })
    }

    getModalHeader = () => {
        return <ModalHeader>
            {`${this.props.selectedModel ? 'Edit' : 'Create'}`} Simulation
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <AddModelForm 
                setModel={(property, value) => {
                    let newModel = this.state.model;
                    newModel[property] = value
                    this.setState({ model: newModel });
                }} 
                selectedModel={this.state.model} 
                basinList={this.state.availableBasins}
                editing={this.state.model.Name !== ""}
                {...this.state.formInvalidFields} />
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-primary"
                onClick={this.checkModel}>Save</button>
            <button type="button" className="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss());
    }

    checkModel = () => {
        let model = this.state.model;
        let newInvalidFields = this.state.formInvalidFields;
        let trimmedName = model.Name.trim();
        model.Name = trimmedName;
        newInvalidFields.NameInvalid = trimmedName === "";
        let trimmedTitle = model.Title.trim();
        model.Title = trimmedTitle;
        newInvalidFields.titleInvalid = trimmedTitle === "";

        newInvalidFields.modelFileInvalid = model.ModelFile === null;
        newInvalidFields.basinInvalid = model.BasinId === 0;
      
        if (newInvalidFields.NameInvalid || newInvalidFields.titleInvalid || newInvalidFields.modelFileInvalid || newInvalidFields.basinInvalid) {
            this.setState({ formInvalidFields: newInvalidFields });
            return Swal.fire({
                title: "Incorrect Form Fields",
                text: "Please fill the required fields correctly to create new simulation!",
                icon: "warning"
            });
        }

        this.saveModel(model);
    }

    saveModel = (model) => {
        let modelToSave = {
            Name: model.Name,
            Title: model.Title,
            ModelFile: model.ModelFile,
            ModelPermissionId: model.ModelPermissionId,
            Training_Percentage: model.Training_Percentage,
            SessionId: (JSON.parse(window.localStorage.getItem("hydroFlowSession"))).sessionId,
            BasinId: model.BasinId
        }
        if (model.Id && model.Id !== undefined) { modelToSave.Id = model.Id }

        ModelsRemote.saveModel(modelToSave)
            .then(response => {
                if (response.status === 403) {
                    response.json().then(errMsg => {
                        Swal.fire({
                            title: "Quota Error",
                            text: errMsg,
                            icon: "error"
                        });
                    });
                } else if (response.status === 500) {
                    Swal.fire({
                        title: "Save Failed",
                        text: "An error occurred while saving simulation!",
                        icon: "error"
                    });
                } else if (response.ok) {
                    Swal.fire({
                        title: "Success",
                        text: `${!this.props.selectedModel ? "Added" : "Saved"} ${model.Name} successfully!`,
                        icon: "success"
                    }).then(() => {
                        this.props.onSave();
                        this.dismissModal();
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

export default AddModelModal;