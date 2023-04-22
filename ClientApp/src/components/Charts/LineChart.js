import React, { Component } from "react";
import Chart from "react-apexcharts";

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    //categories: [1991, 1992, 1993, 1994, 1995, 1996]
                    categories: this.props.date
                }
            },
            series: [
                {
                    name: this.props.type1,
                    //data: [30, 40, 45, 50, 49]
                    data: this.props.actual
                },
                {
                    name: this.props.type2,
                    //data: [70, 20, 85, 30, 79]
                    data: this.props.predicted
                }
            ]
        };
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