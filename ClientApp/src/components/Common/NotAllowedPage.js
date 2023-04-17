import React from "react";
import "./NotAllowed.css"
import {Navigate} from "react-router-dom";

class NotAllowedPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigateToHome: false
        }
    }
    
    goHome = () => {
        this.setState({ navigateToHome: true });
    }

    render() {
        return this.state.navigateToHome ? <Navigate to={"/"}/> : <div className={"container-notallowed"}>
            <div className={"not-allowed-container"}>
                <img src={"/icon-block.png"} alt={"Block Icon"}/>
                <h2>You are not allowed to view this page.</h2>
                <button
                    type="button"
                    className="btn btn-primary go-home-btn"
                    onClick={this.goHome}>
                    Go to Home Page
                </button>
            </div>
        </div>
    }
}

export default NotAllowedPage;