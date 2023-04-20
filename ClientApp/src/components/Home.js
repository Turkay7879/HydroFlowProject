import React, {Component} from 'react';
import LineChart from './Charts/LineChart';
import ScatterChart from './Charts/ScatterChart';
import ModelCalculation from "./ABCD_Model/ModelCalculation";


export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            actualObsmmValues: null,
            predictedQmodelValues: null,
            samples: null
        }
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
           samples: result.samples.map(value => value)
        });
    }

    render() {
        return (
            <div>
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
        );
    }
}

