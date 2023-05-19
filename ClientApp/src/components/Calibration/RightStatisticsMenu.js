import React from "react";

class RightStatisticsMenu extends React.Component {
    STATISTICS_PRECISION = 6;

    constructor(props) {
        super(props);
        this.state = {
            rmse: props.errorRates.rmse,
            nse: props.errorRates.nse,
            deviation: {
                calculatedData: props.errorRates.qModelDeviation,
                p: props.errorRates.pDeviation,
                et: props.errorRates.etDeviation,
                observedData: props.errorRates.obsmmDeviation
            },
            skewness: {
                calculatedData: props.errorRates.qModelSkewness,
                p: props.errorRates.pSkewness,
                et: props.errorRates.etSkewness,
                observedData: props.errorRates.obsmmSkewness
            },
            average: {
                calculatedData: props.errorRates.qModelAvg,
                p: props.errorRates.pAvg,
                et: props.errorRates.etAvg,
                observedData: props.errorRates.obsmmAvg
            }
        };
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errorRates !== this.props.errorRates) {
            this.setState({ 
                rmse: this.props.errorRates.rmse,
                nse: this.props.errorRates.nse,
                deviation: {
                    calculatedData: this.props.errorRates.qModelDeviation,
                    p: this.props.errorRates.pDeviation,
                    et: this.props.errorRates.etDeviation,
                    observedData: this.props.errorRates.obsmmDeviation
                },
                skewness: {
                    calculatedData: this.props.errorRates.qModelSkewness,
                    p: this.props.errorRates.pSkewness,
                    et: this.props.errorRates.etSkewness,
                    observedData: this.props.errorRates.obsmmSkewness
                },
                average: {
                    calculatedData: this.props.errorRates.qModelAvg,
                    p: this.props.errorRates.pAvg,
                    et: this.props.errorRates.etAvg,
                    observedData: this.props.errorRates.obsmmAvg
                }
            });
        }
    }

    render() {
        return (
            <div className={"statistics-main-container"}>
                <h4>Statistics</h4>

                <div className={"current-statistics"}>
                    <span>RMSE: {Number(this.state.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                    <span>NSE: {Number(this.state.nse).toFixed(this.STATISTICS_PRECISION)}</span>

                    <span>Standart Deviations: </span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column" }}>
                        <span>Observed Data: {Number(this.state.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated Data: {Number(this.state.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>P: {Number(this.state.deviation.p ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Et: {Number(this.state.deviation.et ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>

                    <span>Skewness: </span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column" }}>
                        <span>Observed Data: {Number(this.state.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated Data: {Number(this.state.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>P: {Number(this.state.skewness.p ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Et: {Number(this.state.skewness.et ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>

                    <span>Averages: </span>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column" }}>
                        <span>Observed Data: {Number(this.state.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated Data: {Number(this.state.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>P: {Number(this.state.average.p ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Et: {Number(this.state.average.et ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default RightStatisticsMenu;