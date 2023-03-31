import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

class AddModelForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingModels: true,
            models: [],
            showModal: false,
            savedModel: false,
            selectedModel: null,
            editingModel: false
        };
    }
    componentDidMount() {
        if (this.props.selectedModel) {
            this.setState({ selectedModel: this.props.selectedModel }, () => {
                this.setState({ loading: false });
            });
        } else { this.setState({ loading: false }); }
    }

    componentDidUpdate() {
        if (this.state.NameInvalid !== this.props.NameInvalid) {
            this.setState({ NameInvalid: this.props.NameInvalid });
        }
        if (this.state.titleInvalid !== this.props.titleInvalid) {
            this.setState({ titleInvalid: this.props.titleInvalid });
        }
        if (this.state.modelFileInvalid !== this.props.modelFileInvalid) {
            this.setState({ modelFileInvalid: this.props.modelFileInvalid });
        }
        if (this.state.modelPermissionIDInvalid !== this.props.modelPermissionIDInvalid) {
            this.setState({ modelPermissionIDInvalid: this.props.modelPermissionIDInvalid });
        }
    }

    render() {
        return <>
            {!this.state.loading && <Form>
                <FormGroup>
                    <Label for="addModelFormName">Model Name</Label>
                    <Input
                        id="addModelFormName"
                        name="Name"
                        type="text"
                        invalid={this.state.modelNameInvalid}
                        //defaultValue={this.state.selectedModel ? this.state.selectedModel.Name : ""}
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
                        // defaultValue={this.state.selectedModel ? this.state.selectedModel.Title : ""}
                        onChange={(e) => this.props.setModel('Title', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addModelFormModelFile">ModelFile</Label>
                    <Input
                        id="addModelFormModelFile"
                        name="ModelFile"
                        type="text"
                        invalid={this.state.titleInvalid}
                        // defaultValue={this.state.selectedModel ? this.state.selectedModel.Title : ""}
                        onChange={(e) => this.props.setModel('ModelFile', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="addModelFormmodelPermissionID">modelPermissionID </Label>
                    <Input
                        id="addModelFormmodelPermissionID"
                        name="ModelPermissionId"
                        type="number"
                        invalid={this.state.modelPermissionIDInvalid}
                        value={this.state.selectedModel ? this.state.selectedModel.ModelPermissionId : ""}
                        onChange={(e) => this.props.setModel('ModelPermissionId', e.target.value)}
                    />
                </FormGroup>




            </Form>}
        </>
    }
}

export default AddModelForm;