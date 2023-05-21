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
                observedData: props.errorRates.obsmmDeviation
            },
            skewness: {
                calculatedData: props.errorRates.qModelSkewness,
                observedData: props.errorRates.obsmmSkewness
            },
            average: {
                calculatedData: props.errorRates.qModelAvg,
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
                    observedData: this.props.errorRates.obsmmDeviation
                },
                skewness: {
                    calculatedData: this.props.errorRates.qModelSkewness,
                    observedData: this.props.errorRates.obsmmSkewness
                },
                average: {
                    calculatedData: this.props.errorRates.qModelAvg,
                    observedData: this.props.errorRates.obsmmAvg
                }
            });
        }
    }
    ///verifikasyon olunca verileri oradan alcaz şimdilik optimizasyondan çektim
    render() {
        return (
            <div>
                <div className="statistics-main-container">
                    <h4 style={{ marginBottom: "1rem" }}>Optimization</h4>
                    <div className="current-statistics">
                        {/* First set of statistics */}
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>RMSE: {Number(this.state.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>NSE: {Number(this.state.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>Averages:</span>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}>Standard Deviations</span>
                    <div style={{  display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}>Skewness:</span>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>
            </div>

              

                <div className="statistics-container">
                    <h4 style={{ marginBottom: "1rem" }}>Verification</h4>
                    <div className="second-statistics">
                        {/* Second set of statistics */}
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>RMSE: {Number(this.state.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>NSE: {Number(this.state.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between", marginRight: "auto" }}>Averages:</span>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                        <span style={{ display: "flex"}}>Standard Deviations</span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Skewness:</span>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Observed:{Number(this.state.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated:{Number(this.state.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    </div>
                </div>
            </div>

        );



    }
}

export default RightStatisticsMenu;