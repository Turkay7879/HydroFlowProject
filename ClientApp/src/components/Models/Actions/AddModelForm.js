import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import Form from "react-bootstrap/Form";
import { FormControlLabel, Switch, Slider } from '@mui/material';
import ModelsRemote from "../flux/ModelsRemote";
import Swal from "sweetalert2";
import { read, utils } from 'xlsx';

class AddModelForm extends React.Component {
    defaultBasinOption = "Select a basin";

    constructor(props) {
        super(props);

        this.state = {
            loadingModels: true,
            models: [],
            showModal: false,
            savedModel: false,
            selectedModel: null,
            editingModal: false,
            basinList: props.basinList,
            extensions: ModelsRemote.getAllowedExtensions(),
            columns: ModelsRemote.getAllowedColumns()
        };
    }

    componentDidMount() {
        // If a selected model is passed as a prop, set it as the selected model in the state.
        if (this.props.selectedModel) {
            this.setState({ selectedModel: this.props.selectedModel }, () => {
                this.setState({ loading: false });
            });
        } else { this.setState({ loading: false }); }
        // If this component is being used for editing a model, set editingModal to true.
        if (this.props.editing) {
            this.setState({ editingModal: true });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Update the state of basinList if it has changed.
        if (prevProps.basinList !== this.props.basinList) {
            this.setState({ basinList: this.props.basinList });
        }
        // Update the state of modelNameInvalid if it has changed.
        if (this.state.NameInvalid !== this.props.NameInvalid) {
            this.setState({ NameInvalid: this.props.NameInvalid });
        }
        // Update the state of titleInvalid if it has changed.
        if (this.state.titleInvalid !== this.props.titleInvalid) {
            this.setState({ titleInvalid: this.props.titleInvalid });
        }
        // Update the state of modelFileInvalid if it has changed.
        if (this.state.modelFileInvalid !== this.props.modelFileInvalid) {
            this.setState({ modelFileInvalid: this.props.modelFileInvalid });
        }
    }

    // Check if the columns in the uploaded model data file match the allowed columns.
    checkColumns = (modelData) => {
        const workbook = read(modelData, { type: "base64" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = utils.sheet_to_json(worksheet, { header: 1 });

        const headers = data[0];
        let invalid = false;
        headers.forEach((header, idx) => {
            // If a header doesn't match the allowed column at the same index, set invalid to true.
            if (!invalid && this.state.columns.at(idx).toLowerCase() !== header.toLowerCase()) {
                invalid = true;
            }
        });

        return !invalid;
    }

    // Handle the file upload event when a user selects a model data file.
    handleFileUpload = (e) => {
        // Check file extension
        const tempFileNameSplitted = e.target.files[0].name.split(".");
        const fileExtension = tempFileNameSplitted.at(tempFileNameSplitted.length - 1);
        if (this.state.extensions.find(extension => extension.toLowerCase() === fileExtension.toLowerCase()) === undefined) {
            // If the file extension is not allowed, show an error message using SweetAlert2.
            return Swal.fire({
                title: "Invalid File",
                text: "Selected file is not a valid Excel data file!",
                icon: "error"
            });
        }

        // Check data file columns
        let reader = new FileReader();
        const originalData = e.target.files[0];

        reader.readAsDataURL(originalData);
        reader.onload = (evt) => {
            if (!this.checkColumns(evt.target.result.substring(78))) {
                // If the file columns are not allowed, show an error message using SweetAlert2.
                return Swal.fire({
                    title: "Invalid File",
                    text: "Selected file contains invalid columns!",
                    icon: "error"
                });
            } else {
                // If the file is valid, set the 'ModelFile' property in the parent component's state to the file data.
                this.props.setModel('ModelFile', evt.target.result.substring(23));
            }
        }
    }

    render() {
        return <>
            {!this.state.loading && <div>
                <FormGroup>
                    <Label for="addModelFormName">Simulation Name</Label>
                    <Input
                        id="addModelFormName"
                        name="Name"
                        type="text"
                        invalid={this.state.modelNameInvalid}
                        defaultValue={this.state.selectedModel ? this.state.selectedModel.Name : ""}
                        onChange={(e) => this.props.setModel('Name', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addModelFormTitle">Title</Label>
                    <Input
                        id="addModelFormTitle"
                        name="Title"
                        type="text"
                        invalid={this.state.titleInvalid}
                        defaultValue={this.state.selectedModel ? this.state.selectedModel.Title : ""}
                        onChange={(e) => this.props.setModel('Title', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="basin-selector-id">Basin</Label>
                    <Form.Select id={"basin-selector-id"} onChange={event => {
                        let basinAsJson = event.target.value;
                        if (basinAsJson === this.defaultBasinOption) { this.props.setModel('BasinId', 0); }
                        else {
                            const basin = JSON.parse(event.target.value);
                            this.props.setModel('BasinId', basin.id);
                        }
                    }}>
                        <option>{this.defaultBasinOption}</option>
                        {
                           // Map the list of basins to options in the select input.

                            this.state.basinList && this.state.basinList.map((basin, idx) => {
                                return <option key={`basinNo${idx}`} value={JSON.stringify(basin)}>{basin.basinName}</option>
                            })
                        }
                    </Form.Select>
                </FormGroup>
                <FormGroup>
                    <Label for="addModelFormModelFile">Data File</Label>
                    <Input
                        id="addModelFormModelFile"
                        name="ModelFile"
                        type="file"
                        invalid={this.state.titleInvalid}
                        disabled={this.state.editingModal}
                        onChange={this.handleFileUpload}
                    />
                </FormGroup>
                <FormControlLabel 
                    control={<Switch
                         // Set the checked state of the switch input based on the ModelPermissionId property of the selected model.

                        checked={this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? true : false : false}
                        onChange={(e) => this.props.setModel('ModelPermissionId', this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? 0 : 1 : 0)}
                    />} 
                     // Set the label text based on the ModelPermissionId property of the selected model.

                    label={`Make Simulation ${this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? 'Private' : 'Public' : 'Public'}`}
                />
            </div>}
        </>
    }
}

export default AddModelForm;
