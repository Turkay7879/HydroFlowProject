import React from "react";
import Slider from "@mui/material/Slider";
import {SaveOutlined, PlayCircleOutline} from "@mui/icons-material";
import {Button, Spinner} from "reactstrap";
import "./Optimization.css";

class LeftOptionsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: null,
            modelingType: null,
            runningOptimization: false
        };
    }
    
    componentDidMount() {
        this.setState({
            selectedModel: this.props.selectedModel,
            modelingType: this.props.modelingType,
            parameters: this.props.parameters
        });
    }
    
    updateParameterValue = (stateValue, newValue) => {
        let parameters = this.state.parameters;
        parameters[stateValue] = newValue;
        this.setState({ parameters: parameters });
    }
    
    onClickOptimize = () => {
        this.setState({ runningOptimization: true });
    }
    
    onClickSave = () => {
        
    }
    
    getParameterSliders = () => {
        if (this.state.modelingType === "ABCD") {
            return (
                <>
                    <div className={"single-slider-container"}>
                        <span>
                            Initial Soil Moisture: { this.state.parameters.initialSoilMoisture }
                        </span>
                        <Slider
                            aria-label={"Soil Moisture Slider"}
                            min={0}
                            max={5}
                            step={0.1}
                            value={this.state.parameters.initialSoilMoisture}
                            onChange={(_event, newValue) => this.updateParameterValue("initialSoilMoisture", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            Initial Groundwater: { this.state.parameters.initialGroundWater }
                        </span>
                        <Slider
                            aria-label={"Groundwater Slider"}
                            min={0}
                            max={5}
                            step={0.1}
                            value={this.state.parameters.initialGroundWater}
                            onChange={(_event, newValue) => this.updateParameterValue("initialGroundWater", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            A: { this.state.parameters.a }
                        </span>
                        <Slider
                            aria-label={"Parameter A Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={this.state.parameters.a}
                            onChange={(_event, newValue) => this.updateParameterValue("a", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            B: { this.state.parameters.b }
                        </span>
                        <Slider
                            aria-label={"Parameter B Slider"}
                            min={0}
                            max={300}
                            step={1}
                            value={this.state.parameters.b}
                            onChange={(_event, newValue) => this.updateParameterValue("b", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            C: { this.state.parameters.c }
                        </span>
                        <Slider
                            aria-label={"Parameter C Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={this.state.parameters.c}
                            onChange={(_event, newValue) => this.updateParameterValue("c", newValue)}
                        />
                    </div>
                    <div className={"single-slider-container"}>
                        <span>
                            D: { this.state.parameters.d }
                        </span>
                        <Slider
                            aria-label={"Parameter D Slider"}
                            min={0}
                            max={1}
                            step={0.01}
                            value={this.state.parameters.d}
                            onChange={(_event, newValue) => this.updateParameterValue("d", newValue)}
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
                    { this.getParameterSliders() }
                    
                    <div className={"button-container"}>
                        <div className={"optimize-button"}>
                            <Button
                                color="primary"
                                disabled={this.state.runningOptimization}
                                onClick={this.onClickOptimize}>
                                {
                                    !this.state.runningOptimization
                                        ? <PlayCircleOutline/>
                                        : <Spinner size={"sm"}/>
                                }
                                <span>
                                    {` ${!this.state.runningOptimization ? 'Optimize' : 'Optimizing'}`}
                                </span>
                            </Button>
                        </div>
                        <div className={"save-button"}>
                            <Button
                                color="success"
                                disabled={this.state.runningOptimization}
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