import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class StatisticsModal extends React.Component {
    STATISTICS_PRECISION = 6;

    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
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
        }
    }

    dismissModal = () => {
        this.setState({ showModal: false }, () => this.props.onDismiss());
    }

    getModalHeader = () => {
        return <ModalHeader>
            Statistics
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <div style={{ 
                display: "flex",
                justifyContent: "space-evenly",
            }}>
                <div style={{
                    border: "3.5px solid #1b6ec2",
                    borderRadius: "10px",
                    padding: "1rem",
                }}>
                    <h4 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Auto-Calibration</h4>
                    <div>
                        <div style={{
                            display: 'flex',
                            flexDirection: "column",
                        }}>
                            <span><b>RMSE:</b> {Number(this.state.optimization.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span><b>NSE:</b> {Number(this.state.optimization.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span><b>Averages:</b></span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                        }}>
                            <span>Observed: {Number(this.state.optimization.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span>Calculated: {Number(this.state.optimization.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    </div>
                    <span><b>Standard Deviations:</b></span>
                    <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                    }}>
                        <span>Observed: {Number(this.state.optimization.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated: {Number(this.state.optimization.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span><b>Skewness:</b></span>
                    <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                    }}>
                        <span>Observed: {Number(this.state.optimization.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated: {Number(this.state.optimization.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>
                <div style={{
                    border: "3.5px solid #1b6ec2",
                    borderRadius: "10px",
                    padding: "1rem",
                }}>
                    <h4 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Verification</h4>
                    <div>
                        <div style={{
                            display: 'flex',
                            flexDirection: "column",
                        }}>
                            <span><b>RMSE:</b> {Number(this.state.verification.rmse).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span><b>NSE:</b> {Number(this.state.verification.nse).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span><b>Averages:</b></span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                        }}>
                            <span>Observed: {Number(this.state.verification.average.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                            <span>Calculated: {Number(this.state.verification.average.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        </div>
                    </div>
                    <span><b>Standard Deviations:</b></span>
                    <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                    }}>
                        <span>Observed: {Number(this.state.verification.deviation.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated: {Number(this.state.verification.deviation.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                    <span><b>Skewness:</b></span>
                    <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            paddingLeft: '1.5rem',
                    }}>
                        <span>Observed: {Number(this.state.verification.skewness.observedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                        <span>Calculated: {Number(this.state.verification.skewness.calculatedData ?? 0).toFixed(this.STATISTICS_PRECISION)}</span>
                    </div>
                </div>
            </div>
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" className="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    render() {
        return (
            <>
                <Modal isOpen={this.state.showModal}>
                    {this.getModalHeader()}
                    {this.getModalBody()}
                    {this.getModalFooter()}
                </Modal>
            </>
        );
    }
}

export default StatisticsModal;