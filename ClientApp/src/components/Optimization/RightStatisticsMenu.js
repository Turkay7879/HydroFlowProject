import React from "react";

class RightStatisticsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rmse: null,
            nse: null,
            bestRmse: null,
            bestNse: null
        };
    }
    
    componentDidMount() {
        this.setState({
            rmse: this.props.errorRates.rmse,
            nse: this.props.errorRates.nse,
            bestRmse: this.props.errorRates.rmse,
            bestNse: this.props.errorRates.nse
        });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errorRates.rmse !== this.props.errorRates.rmse) {
            this.setState({ 
                rmse: this.props.errorRates.rmse,
                bestRmse: this.props.errorRates.rmse < this.state.bestRmse ? this.props.errorRates.rmse : this.state.bestRmse
            });
        }
        if (prevProps.errorRates.nse !== this.props.errorRates.nse) {
            this.setState({ 
                nse: this.props.errorRates.nse,
                bestNse: this.props.errorRates.nse > this.state.bestNse ? this.props.errorRates.nse : this.state.bestNse
            });
        }
    }

    render() {
        return (
            <div className={"statistics-main-container"}>
                <h4>Statistics</h4>

                <span>Current:</span>
                <div className={"current-statistics"}>
                    <span>RMSE: {this.state.rmse}</span>
                    <span>NSE: {this.state.nse}</span>
                </div>
                
                <span>Best:</span>
                <div className={"best-statistics"}>
                    <span>RMSE: {this.state.bestRmse}</span>
                    <span>NSE: {this.state.bestNse}</span>
                </div>
            </div>
        );
    }
}

export default RightStatisticsMenu;