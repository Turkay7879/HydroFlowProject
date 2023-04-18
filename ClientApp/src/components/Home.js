import React, {Component} from 'react';
import LineChart from './Charts/LineChart';
import ModelCalculation from "./ABCD_Model/ModelCalculation";


export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <ModelCalculation/>
                <LineChart/>
            </div>
        );
    }
}
