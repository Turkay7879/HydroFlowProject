
import React, { Component } from "react";
import Chart from "react-apexcharts";
import ModelCalculation from "../ABCD_Model/ModelCalculation";

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                    //categories: []
                }
            },
            series: [
                {
                    name: "series-1",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                    //data: []
                },
                {
                    name: "series-2",
                    data: [70, 20, 85, 30, 79, 20, 50, 21]
                    //data: []
                }
            ]
        };
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData = () => {
        //dosyadan okunanlar çekilip state güncellencek
    }

    render() {
        return (
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="line"
                            width="500"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default LineChart;