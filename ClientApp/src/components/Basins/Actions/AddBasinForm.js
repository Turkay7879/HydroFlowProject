import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

class AddBasinForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedBasin: null,
            basinNameInvalid: this.props.basinNameInvalid,
            flowStationNoInvalid: this.props.flowStationNoInvalid,
            flowStationLatInvalid: this.props.flowStationLatInvalid,
            flowStationLongInvalid: this.props.flowStationLongInvalid,
            fieldInvalid: this.props.fieldInvalid
        };
    }

    componentDidMount() {
        // Set form fields if a basin is being edited
        if (this.props.selectedBasin) {
            this.setState({ selectedBasin: this.props.selectedBasin }, () => {
                this.setState({ loading: false });
            });
        } else { this.setState({ loading: false }); }
    }

    componentDidUpdate() {
        if (this.state.basinNameInvalid !== this.props.basinNameInvalid) {
            this.setState({ basinNameInvalid: this.props.basinNameInvalid });
        }
        if (this.state.flowStationNoInvalid !== this.props.flowStationNoInvalid) {
            this.setState({ flowStationNoInvalid: this.props.flowStationNoInvalid });
        }
        if (this.state.flowStationLatInvalid !== this.props.flowStationLatInvalid) {
            this.setState({ flowStationLatInvalid: this.props.flowStationLatInvalid });
        }
        if (this.state.flowStationLongInvalid !== this.props.flowStationLongInvalid) {
            this.setState({ flowStationLongInvalid: this.props.flowStationLongInvalid });
        }
        if (this.state.fieldInvalid !== this.props.fieldInvalid) {
            this.setState({ fieldInvalid: this.props.fieldInvalid });
        }
    }

    render() {
        return <>
            {!this.state.loading && <Form>
                <FormGroup>
                    <Label for="addBasinFormName">Basin Name</Label>
                    <Input
                        id="addBasinFormName"
                        name="BasinName"
                        type="text"
                        invalid={this.state.basinNameInvalid}
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.basinName : ""}
                        onChange={(e) => this.props.setBasin('basinName', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addBasinFormFlowStation">Flow Station No</Label>
                    <Input
                        id="addBasinFormFlowStation"
                        name="FlowStationNo"
                        type="text"
                        invalid={this.state.flowStationNoInvalid}
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.flowStationNo : ""}
                        onChange={(e) => this.props.setBasin('flowStationNo', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addBasinFormFlowStationLat">Flow Station Latitude</Label>
                    <Input
                        id="addBasinFormFlowStationLat"
                        name="FlowObservationStationLat"
                        type="text"
                        invalid={this.state.flowStationLatInvalid}
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.flowObservationStationLat : ""}
                        onChange={(e) => this.props.setBasin('flowObservationStationLat', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addBasinFormFlowStationLong">Flow Station Longitude</Label>
                    <Input
                        id="addBasinFormFlowStationLong"
                        name="FlowObservationStationLong"
                        type="text"
                        invalid={this.state.flowStationLongInvalid}
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.flowObservationStationLong : ""}
                        onChange={(e) => this.props.setBasin('flowObservationStationLong', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addBasinFormField">Area Field (km^2)</Label>
                    <Input
                        id="addBasinFormField"
                        name="Field"
                        type="text"
                        invalid={this.state.fieldInvalid}
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.field : ""}
                        onChange={(e) => this.props.setBasin('field', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="addBasinFormDescription">Description</Label>
                    <Input
                        id="addBasinFormDescription"
                        name="Description"
                        type="text"
                        defaultValue={this.state.selectedBasin ? this.state.selectedBasin.description : ""}
                        onChange={(e) => this.props.setBasin('description', e.target.value)}
                    />
                </FormGroup>
            </Form>}
        </>
    }
}

export default AddBasinForm;