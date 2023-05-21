import React from "react";

class RightStatisticsMenu extends React.Component {
    STATISTICS_PRECISION = 6;

    constructor(props) {
        super(props);
        this.state = {
            rmse: props.errorRates.rmse,
            nse: props.errorRates.nse,
            average: {
                calculatedData: props.errorRates.qModelAvg,
                observedData: props.errorRates.obsmmAvg
            },
            deviation: {
                calculatedData: props.errorRates.qModelDeviation,
                observedData: props.errorRates.obsmmDeviation
            },
            skewness: {
                calculatedData: props.errorRates.qModelSkewness,
                observedData: props.errorRates.obsmmSkewness
            }

        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errorRates !== this.props.errorRates) {
            this.setState({
                rmse: this.props.errorRates.rmse,
                nse: this.props.errorRates.nse,
                average: {
                    calculatedData: this.props.errorRates.qModelAvg,
                    observedData: this.props.errorRates.obsmmAvg
                },
                deviation: {
                    calculatedData: this.props.errorRates.qModelDeviation,
                    observedData: this.props.errorRates.obsmmDeviation
                },
                skewness: {
                    calculatedData: this.props.errorRates.qModelSkewness,
                    observedData: this.props.errorRates.obsmmSkewness
                }

            });
        }
    }

    render() {
        return (
            <div className={"statistics-main-container"} style={{ marginBottom: "1rem" }}>
                <h4 style={{ marginBottom: "1rem" }}>Statistics</h4>
                <div className="current-statistics" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>RMSE: {Number(this.state.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                    <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>NSE: {Number(this.state.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                    <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Averages:</span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Observed Data: {Number(this.state.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Calculated Data: {Number(this.state.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Standard Deviations:</span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Observed Data: {Number(this.state.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Calculated Data: {Number(this.state.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Skewness:</span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Observed Data: {Number(this.state.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>Calculated Data:{Number(this.state.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>

                    </div>
                </div>



        );
    }
}

export default RightStatisticsMenu;