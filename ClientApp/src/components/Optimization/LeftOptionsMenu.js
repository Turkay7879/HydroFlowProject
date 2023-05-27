import React from "react";
import Slider from "@mui/material/Slider";
import {SaveOutlined, PlayCircleOutline} from "@mui/icons-material";
import {Button, Spinner} from "reactstrap";
import Swal from "sweetalert2";
import OptimizationRemote from "./flux/remote/OptimizationRemote";
import "./Optimization.css";

class LeftOptionsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: null,
            modelingType: null,
            percentage: 80,
            runningOptimization: false
        };
    }
    
    componentDidMount() {
        this.setState({
            selectedModel: this.props.selectedModel,
            modelingType: this.props.modelingType,
            parameters: this.props.parameters,
            isRunning: this.props.isOptimizationRunning,
            originalParamList: this.props.originalParameters
        });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedModel !== this.props.selectedModel) {
            this.setState({selectedModel: this.props.selectedModel});
        }
        if (prevProps.modelingType !== this.props.modelingType) {
            this.setState({ modelingType: this.props.modelingType });
        }
        if (prevProps.parameters !== this.props.parameters) {
            this.setState({ parameters: this.props.parameters });
        }
        if (prevProps.isOptimizationRunning !== this.props.isOptimizationRunning) {
            this.setState({ isRunning: this.props.isOptimizationRunning });
        }
        if (prevProps.originalParameters !== this.props.originalParameters) {
            this.setState({ originalParamList: this.props.originalParameters });
        }
    }

    updateParameterValue = (stateValue, newValue) => {
        let parameters = this.state.parameters;
        parameters[stateValue] = newValue;
        this.setState({ parameters: parameters }, () => this.props.onParameterChange(parameters));
    }
    
    onClickOptimize = () => {
        this.props.onStartOptimize(this.state.percentage)
    }
    
    onClickSave = () => {
        let originalList = this.state.originalParamList;
        let Parameter_Map = new Map();

        if (this.state.modelingType === "ABCD") {
            let a = originalList.find(p => p.model_Param_Name === "a")
            let b = originalList.find(p => p.model_Param_Name === "b")
            let c = originalList.find(p => p.model_Param_Name === "c")
            let d = originalList.find(p => p.model_Param_Name === "d")
            let initialSt = originalList.find(p => p.model_Param_Name === "initialSt")
            let initialGt = originalList.find(p => p.model_Param_Name === "initialGt")

            Parameter_Map.set(a.parameter_Id, this.state.parameters.a);
            Parameter_Map.set(b.parameter_Id, this.state.parameters.b);
            Parameter_Map.set(c.parameter_Id, this.state.parameters.c);
            Parameter_Map.set(d.parameter_Id, this.state.parameters.d);
            Parameter_Map.set(initialSt.parameter_Id, this.state.parameters.initialSt);
            Parameter_Map.set(initialGt.parameter_Id, this.state.parameters.initialGt);
        }

        let session = JSON.parse(window.localStorage.getItem("hydroFlowSession"));
        let payload = {
            User_Id: session.sessionUserId,
            Model_Id: this.state.selectedModel.id,
            Model_Name: this.state.selectedModel.name,
            Parameter_Map: JSON.stringify(Object.fromEntries(Parameter_Map)),
            Optimization_Percentage: this.state.percentage
        }
        OptimizationRemote.saveModelParameters(payload).then(response => response.json().then(_data => {
            Swal.fire({
                title: "Save Successfull",
                text: "Simulation and parameters have been saved!",
                icon: "success"
            });
        }));
    }
    
    getParameterSliders = () => {
        if (this.state.modelingType === "ABCD") {
            let param_A = this.state.parameters.a;
            let param_B = this.state.parameters.b;
            let param_C = this.state.parameters.c;
            let param_D = this.state.parameters.d;
            let param_St = this.state.parameters.initialSt;
            let param_Gt = this.state.parameters.initialGt;
            let percentage = this.state.percentage;
            
            return (
                <>
                    <div className={"single-slider-container"}>
                        <span>
                            Initial Soil Moisture: {param_St}
                        </span>
                        <Slider
                            aria-label={"Soil Moisture Slider"}
                            min={0}
                            max={5}
                            step={0.1}
                            value={param_St}
                            onChange={(_event, newValue) => this.updateParameterValue("initialSt", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            Initial Groundwater: {param_Gt}
                        </span>
                        <Slider
                            aria-label={"Groundwater Slider"}
                            min={0}
                            max={5}
                            step={0.1}
                            value={param_Gt}
                            onChange={(_event, newValue) => this.updateParameterValue("initialGt", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            A: {param_A}
                        </span>
                        <Slider
                            aria-label={"Parameter A Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={param_A}
                            onChange={(_event, newValue) => this.updateParameterValue("a", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            B: {param_B}
                        </span>
                        <Slider
                            aria-label={"Parameter B Slider"}
                            min={0}
                            max={300}
                            step={1}
                            value={param_B}
                            onChange={(_event, newValue) => this.updateParameterValue("b", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            C: {param_C}
                        </span>
                        <Slider
                            aria-label={"Parameter C Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={param_C}
                            onChange={(_event, newValue) => this.updateParameterValue("c", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            D: {param_D}
                        </span>
                        <Slider
                            aria-label={"Parameter D Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={param_D}
                            onChange={(_event, newValue) => this.updateParameterValue("d", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            Data % For Optimization: {percentage}
                        </span>
                        <Slider
                            aria-label="Optimization Percentage Slider"
                            min={10}
                            max={90}
                            step={1}
                            value={percentage}
                            onChange={(_event, newValue) => this.setState({ percentage: newValue })}
                        />
                    </div>
                </>  
            );
        }
    }

    render() {
        return (
            <>
                <div className={"main-left-panel"}>
                    <h4>Parameters</h4>
                    { this.state.parameters && this.getParameterSliders() }
                    
                    <div className={"button-container"}>
                        <div className={"optimize-button"}>
                            <Button
                                color="primary"
                                disabled={this.state.isRunning || !this.state.selectedModel}
                                onClick={this.onClickOptimize}>
                                {
                                    !this.state.isRunning
                                        ? <PlayCircleOutline/>
                                        : <Spinner size={"sm"}/>
                                }
                                <span>
                                    {` ${!this.state.isRunning ? 'Auto Calibrate' : 'Processing'}`}
                                </span>
                            </Button>
                        </div>
                        <div className={"save-button"}>
                            <Button
                                color="success"
                                disabled={this.state.isRunning || !this.state.selectedModel}
                                onClick={this.onClickSave}>
                                <SaveOutlined/>
                                <span>
                                    {' '} Save
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default LeftOptionsMenu;