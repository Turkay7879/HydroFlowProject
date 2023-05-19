import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import Form from "react-bootstrap/Form";
import { FormControlLabel, Switch, Slider } from '@mui/material';

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
            basinList: props.basinList
        };
    }
    componentDidMount() {
        if (this.props.selectedModel) {
            this.setState({ selectedModel: this.props.selectedModel }, () => {
                this.setState({ loading: false });
            });
        } else { this.setState({ loading: false }); }
        if (this.props.editing) {
            this.setState({ editingModal: true });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.basinList !== this.props.basinList) {
            this.setState({ basinList: this.props.basinList });
        }
        if (this.state.NameInvalid !== this.props.NameInvalid) {
            this.setState({ NameInvalid: this.props.NameInvalid });
        }
        if (this.state.titleInvalid !== this.props.titleInvalid) {
            this.setState({ titleInvalid: this.props.titleInvalid });
        }
        if (this.state.modelFileInvalid !== this.props.modelFileInvalid) {
            this.setState({ modelFileInvalid: this.props.modelFileInvalid });
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
                        onChange={(e) => {
                            let reader = new FileReader();
                            reader.readAsDataURL(e.target.files[0]);
                            reader.onload = (evt) => {
                                this.props.setModel('ModelFile', evt.target.result.substring(23))
                            }
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="trainingPercentageSlider">Data percentage to be used for Optimization (Remaining is used for testing):</Label>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ marginTop: "1rem", width: "90%"}}>
                            <Slider
                                aria-label="Training Data Percentage Slider"
                                name="trainingPercentageSlider"
                                defaultValue={this.state.selectedModel ? this.state.selectedModel.Training_Percentage : 80}
                                step={1}
                                min={20}
                                max={90}
                                marks={[{label: "20%", value: 20}, {label: "90%", value: 90}]}
                                valueLabelDisplay="on"
                                onChange={(e) => this.props.setModel('Training_Percentage', e.target.value)}
                            />
                        </div>
                    </div>
                </FormGroup>
                <FormControlLabel 
                    control={<Switch
                        checked={this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? true : false : false}
                        onChange={(e) => this.props.setModel('ModelPermissionId', this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? 0 : 1 : 0)}
                    />} 
                    label={`Make Simulation ${this.state.selectedModel ? this.state.selectedModel.ModelPermissionId === 1 ? 'Private' : 'Public' : 'Public'}`}
                />
            </div>}
        </>
    }
}

export default AddModelForm;