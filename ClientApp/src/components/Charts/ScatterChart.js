import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class ScatterChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: "x-observed y-simulated",
                    data: props.samples
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy'
                    }
                },
                xaxis: {
                    tickAmount: 10,
                    labels: {
                        formatter: function(val) {
                            return parseFloat(val).toFixed(1)
                        }
                    }
                },
                yaxis: {
                    tickAmount: 7
                }
            },


        };
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.samples !== this.props.samples) {
            let series = [{ name: "x-observed y-simulated", data: this.props.samples }];
            this.setState({ series: series });
        }
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" width={500} />
            </div>
        );
    }
}

export default ScatterChart;
