import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import ModelsRemote from "../flux/ModelsRemote";
import BasinsRemote from "../../Basins/flux/BasinsRemote";
import AddModelForm from "./AddModelForm";

class AddModelModal extends React.Component {
    // Class constructor
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {
            showModal: false, // Whether the modal is visible or not
            model: {
                Name: "", // The name of the model
                Title: "", // The title of the model
                CreateDate: null, // The creation date of the model
                ModelFile: null, // The file that contains the model
                ModelPermissionId: 0, // The permission id of the model
                BasinId: 0 // The basin id of the model
            },
            formInvalidFields: {
                NameInvalid: false, // Whether the name field is invalid or not
                titleInvalid: false, // Whether the title field is invalid or not
                modelFileInvalid: false, // Whether the model file field is invalid or not
                basinInvalid: false // Whether the basin field is invalid or not
            },
            availableBasins: null // The list of available basins
        };
    }

    /**
     * Lifecycle method called after the component mounts.
     * Gets the basin list from the server and sets the state accordingly.
     */

    componentDidMount() {
        if (this.props.selectedModel !== null && this.props.selectedModel !== undefined) {
            this.setState({ model: this.props.selectedModel }, () => {
                this.setState({ showModal: this.props.showModal }, () => this.getBasinList());
            });
        } else {
            this.setState({ showModal: this.props.showModal }, () => this.getBasinList());
        }
    }

    /**
   * Gets the list of basins from the server and sets the state accordingly.
   */
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
    /**
     * Gets the modal header.
     * @returns The modal header component.
     */
    getModalHeader = () => {
        return <ModalHeader>
            {`${this.props.selectedModel ? 'Edit' : 'Create'}`} Simulation
        </ModalHeader>
    }

    /**
    * Gets the modal body.
    * @returns The modal body component.
    */
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
    /**
    * Gets the modal footer.
    * @returns The modal footer component.
    */
    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-primary"
                onClick={this.checkModel}>Save</button>
            <button type="button" className="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }
    /**
    * Dismisses the modal.
    * Calls the onDismiss prop function.
    */
    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss());
    }
    /**
     * Checks if the model is valid and saves it to the server.
     * Shows an error message if any required field is invalid.
     */
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
               // Show an error message if any required field is invalid
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
    /**
  * Renders the component.
  * @returns The component's HTML representation.
  */
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