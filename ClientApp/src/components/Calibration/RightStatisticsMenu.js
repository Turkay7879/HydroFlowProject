import React from "react";

class RightStatisticsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rmse: null,
            nse: null,
        };
    }
    
    componentDidMount() {
        this.setState({
            rmse: this.props.errorRates.rmse,
            nse: this.props.errorRates.nse,
        });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errorRates !== this.props.errorRates) {
            this.setState({ 
                rmse: this.props.errorRates.rmse,
                nse: this.props.errorRates.nse
            });
        }
    }

    render() {
        return (
            <div className={"statistics-main-container"}>
                <h4>Statistics</h4>

                <div className={"current-statistics"}>
                    <span>RMSE: {Number(this.state.rmse).toFixed(6)}</span>
                    <span>NSE: {Number(this.state.nse).toFixed(6)}</span>
                </div>
            </div>
        );
    }
}

export default RightStatisticsMenu;