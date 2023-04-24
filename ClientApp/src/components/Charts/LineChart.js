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
                    categories: this.props.date
                }
            },
            series: [
                {
                    name: this.props.type1,
                    data: this.props.actual
                },
                {
                    name: this.props.type2,
                    data: this.props.predicted
                }
            ]
        };
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.actual !== this.props.actual || prevProps.predicted !== this.props.predicted) {
            let series = [
                { name: this.props.type1, data: this.props.actual },
                { name: this.props.type2, data: this.props.predicted }
            ]
            this.setState({ series: series });
        }
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