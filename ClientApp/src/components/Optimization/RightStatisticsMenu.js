import React from "react";
import "./Optimization.css";

class RightStatisticsMenu extends React.Component {
    STATISTICS_PRECISION = 6;

    constructor(props) {
        super(props);
        this.state = {
            optimization: {
                rmse: props.errorRates.optimization.rmse,
                nse: props.errorRates.optimization.nse,
                deviation: {
                    calculatedData: props.errorRates.optimization.qModelDeviation,
                    observedData: props.errorRates.optimization.obsmmDeviation
                },
                skewness: {
                    calculatedData: props.errorRates.optimization.qModelSkewness,
                    observedData: props.errorRates.optimization.obsmmSkewness
                },
                average: {
                    calculatedData: props.errorRates.optimization.qModelAvg,
                    observedData: props.errorRates.optimization.obsmmAvg
                }
            },
            verification: {
                rmse: props.errorRates.verification.rmse,
                nse: props.errorRates.verification.nse,
                deviation: {
                    calculatedData: props.errorRates.verification.qModelDeviation,
                    observedData: props.errorRates.verification.obsmmDeviation
                },
                skewness: {
                    calculatedData: props.errorRates.verification.qModelSkewness,
                    observedData: props.errorRates.verification.obsmmSkewness
                },
                average: {
                    calculatedData: props.errorRates.verification.qModelAvg,
                    observedData: props.errorRates.verification.obsmmAvg
                }
            }
        };
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errorRates !== this.props.errorRates) {
            this.setState({ 
                optimization: {
                    rmse: this.props.errorRates.optimization.rmse,
                    nse: this.props.errorRates.optimization.nse,
                    deviation: {
                        calculatedData: this.props.errorRates.optimization.qModelDeviation,
                        observedData: this.props.errorRates.optimization.obsmmDeviation
                    },
                    skewness: {
                        calculatedData: this.props.errorRates.optimization.qModelSkewness,
                        observedData: this.props.errorRates.optimization.obsmmSkewness
                    },
                    average: {
                        calculatedData: this.props.errorRates.optimization.qModelAvg,
                        observedData: this.props.errorRates.optimization.obsmmAvg
                    }
                },
                verification: {
                    rmse: this.props.errorRates.verification.rmse,
                    nse: this.props.errorRates.verification.nse,
                    deviation: {
                        calculatedData: this.props.errorRates.verification.qModelDeviation,
                        observedData: this.props.errorRates.verification.obsmmDeviation
                    },
                    skewness: {
                        calculatedData: this.props.errorRates.verification.qModelSkewness,
                        observedData: this.props.errorRates.verification.obsmmSkewness
                    },
                    average: {
                        calculatedData: this.props.errorRates.verification.qModelAvg,
                        observedData: this.props.errorRates.verification.obsmmAvg
                    }
                }
            });
        }
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
                <div className="statistics-main-container">
                    <h4 style={{ marginBottom: "1rem", marginLeft: "1rem", fontSize: "1.5rem" }}>Optimization</h4>
                    <div className="current-statistics">
                        <span><b>RMSE:</b>  {Number(this.state.optimization.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span><b>NSE:</b> {Number(this.state.optimization.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span><b>Averages</b></span>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Observed: {Number(this.state.optimization.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.optimization.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}><b>Standard Deviations</b></span>
                    <div className="standart-deviation-optimization">
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed: {Number(this.state.optimization.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.optimization.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}><b>Skewness</b></span>
                    <div className="standart-deviation-optimization">
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed: {Number(this.state.optimization.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.optimization.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>

                <div className="statistics-main-container">
                    <h4 style={{ marginBottom: "1rem", marginLeft: "1rem", fontSize: "1.5rem" }}>Verification</h4>
                    <div className="current-statistics">
                        <span><b>RMSE:</b> {Number(this.state.verification.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span><b>NSE:</b> {Number(this.state.verification.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span><b>Averages</b></span>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", justifyContent: "space-between", fontSize: "1.0rem" }}>Observed: {Number(this.state.verification.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.verification.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}><b>Standard Deviations</b></span>
                    <div className="standart-deviation-optimization">
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed: {Number(this.state.verification.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.verification.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span style={{ display: "flex", justifyContent: "space-between" }}><b>Skewness</b></span>
                    <div className="standart-deviation-optimization">
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Observed: {Number(this.state.verification.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span style={{ display: "flex", justifyContent: "space-between" }}>Calculated: {Number(this.state.verification.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default RightStatisticsMenu;