import React from "react";
import ModelSelectorPane from "./ModelSelectorPane";
import LeftOptionsMenu from "./LeftOptionsMenu";
import RightStatisticsMenu from "./RightStatisticsMenu";
import LineChart from "../Charts/LineChart";
import ScatterChart from "../Charts/ScatterChart";
import ModelCalculation from "../ABCD_Model/ModelCalculation";

class Optimization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: null,
            userModels: null,
            modelingType: "ABCD",
            parameters: {
                initialSoilMoisture: 2,
                initialGroundWater: 2,
                a: 1,
                b: 5,
                c: 0.5,
                d: 0.1
            },
            errorRates: {
                rmse: null,
                nse: null
            },
            actualObsmmValues: null,
            predictedQmodelValues: null,
            samples: null
        };
    }
    
    componentDidMount() {
        // Request models uploaded by current user and add them to 'this.state.userModels'
        // User info should be in session token
    }

    onOptimizationFinished = (result) => {
        this.setState({
            type1: result.type1,
            actualObsmmValues: result.actualValues.map(value => Math.trunc(value)),
            type2: result.type2,
            predictedQmodelValues: result.qModelValues.map(value => Math.trunc(value)),
            date: result.date.map(value => value)
        });
    }

    onCalibrationScatter = (result) => {
        this.setState({
            samples: result.samples
        });
    }

    changeSelectedModel = (newModel) => {
        this.setState({ selectedModel: newModel });
    }
    
    render() {
        return (
            <>
                <ModelSelectorPane
                    userModelList={this.state.userModels}
                    onSelectModel={(newModel) => this.state.changeSelectedModel(newModel)}
                />
                
                <div className={"optimizations-container"}>
                    <LeftOptionsMenu
                        selectedModel={this.state.selectedModel}
                        modelingType={this.state.modelingType}
                        parameters={this.state.parameters}
                    />

                    <div className={"optimization-output-main-container"}>
                        <ModelCalculation
                            onOptimizationFinished={this.onOptimizationFinished}
                            onCalibrationScatter={this.onCalibrationScatter}/>
                        {
                            this.state.actualObsmmValues && this.state.predictedQmodelValues && <LineChart
                                type1={this.state.type1}
                                actual={this.state.actualObsmmValues}
                                type2={this.state.type2}
                                predicted={this.state.predictedQmodelValues}
                                date={this.state.date}/>
                        }{
                        this.state.samples &&  <ScatterChart
                            samples={this.state.samples}/>
                    }
                    </div>

                    <RightStatisticsMenu
                        errorRates={this.state.errorRates}
                    />
                </div>
            </>
        );
    }
}

export default Optimization;