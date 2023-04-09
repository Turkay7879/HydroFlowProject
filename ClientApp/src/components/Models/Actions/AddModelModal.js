import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import ModelsRemote from "../flux/ModelsRemote";
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
            },
            formInvalidFields: {
                NameInvalid: false,
                titleInvalid: false,
                modelFileInvalid: false,
                modelPermissionIdInvalid: false
            }
        };
    }



    componentDidMount() {
        if (this.props.selectedModel !== null && this.props.selectedModel !== undefined) {
            this.setState({ model: this.props.selectedModel }, () => {
                this.setState({ showModal: this.props.showModal });
            });
        } else {
            this.setState({ showModal: this.props.showModal });
        }
    }


    getModalHeader = () => {
        return <ModalHeader>
            Add Model
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <AddModelForm setModel={(property, value) => {
                let newModel = this.state.model;
                newModel[property] = value
                this.setState({ model: newModel });
            }} selectedModel={this.state.model} {...this.state.formInvalidFields} />
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-primary"
                onClick={this.checkModel}>Save Model</button>
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

        newInvalidFields.modelFileInvalid = model.ModelFile === undefined;
      
        // if (!model.ModelPermissionId) {
        //       newInvalidFields.modelPermissionIdInvalid = true;
        //   } else {
        //       let parsedModelPermissionId = parseInt(model.ModelPermissionId);
        //       if (isNaN(parsedModelPermissionId)) {
        //           newInvalidFields.modelPermissionIdInvalid = true;
        //       } else {
        //           model.ModelPermissionId = parsedModelPermissionId;
        //           newInvalidFields.modelPermissionIdInvalid = false;
        //       }
  
        //   }
        if (newInvalidFields.NameInvalid || newInvalidFields.titleInvalid || newInvalidFields.modelFileInvalid) {
            this.setState({ formInvalidFields: newInvalidFields });
            return Swal.fire({
                title: "Incorrect Form Fields",
                text: "Please fill the required fields correctly to save new basin!",
                icon: "warning"
            });
        }

        this.saveModel(model);
    }

    saveModel = (model) => {
        //const base64ModelFile = btoa(String.fromCharCode.apply(null, new Uint8Array(model.ModelFile))); // ModelFile özelliğinin base64 kodlaması yapılıyor
        //let createDate = model.CreateDate ? model.CreateDate.toISOString() : new Date().toISOString(); // Değişken tanımı yapılıyor
        let modelToSave = {
            Name: model.Name,
            Title: model.Title,
            //CreateDate: createDate, // Değişken kullanılıyor
            ModelFile: model.ModelFile, // base64 kodlaması yapılmış ModelFile özelliği kullanılıyor
            ModelPermissionId: 0
        }
        if (model.Id && model.Id !== undefined) { modelToSave.Id = model.Id }

        return ModelsRemote.saveModel(modelToSave)
            .then(response => {
                console.log("Model saved successfully!");
                console.log(response);
                Swal.fire({
                    title: !this.props.selectedModel ? "Added Model" : "Saved Model",
                    text: `${!this.props.selectedModel ? "Added" : "Saved"} ${model.Name} successfully!`,
                    icon: "success"
                }).then(() => {
                    this.props.onSave();
                    this.dismissModal();
                });
            })
            .catch(error => {
                console.error("Error saving model:", error);
                Swal.fire({
                    title: "Save Failed",
                    text: "An error occurred while saving model!",
                    icon: "error"
                });
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