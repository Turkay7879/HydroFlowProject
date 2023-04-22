import React from "react";
import "./Optimization.css";

class ModelSelectorPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelList: null
        };
    }
    
    componentDidMount() {
        this.setState({ modelList: this.props.userModelList });
    }

    render() {
        return (
            <div className={"model-selector-container"}>
                <div className={"selected-model"}>
                    <span>Selected Model: {this.state.selectedModel ? this.state.selectedModel.title : ""}</span>
                </div>
                <div>
                    {/* Selector component */}
                </div>
            </div>
        );
    }
}

export default ModelSelectorPane;