import React from "react";
import ModelSelectorPane from "./ModelSelectorPane";
import LeftOptionsMenu from "./LeftOptionsMenu";
import RightStatisticsMenu from "./RightStatisticsMenu";

class Optimization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: null,
            userModels: null,
            modelingType: "ABCD",
            parameters: {
                initialSoilMoisture: 2,
                initialGroundWater: 2,
                a: 1,
                b: 5,
                c: 0.5,
                d: 0.1
            },
            errorRates: {
                rmse: null,
                nse: null
            }
        };
    }
    
    componentDidMount() {
        // Request models uploaded by current user and add them to 'this.state.userModels'
        // User info should be in session token
    }

    changeSelectedModel = (newModel) => {
        this.setState({ selectedModel: newModel });
    }
    
    render() {
        return (
            <>
                <ModelSelectorPane
                    userModelList={this.state.userModels}
                    onSelectModel={(newModel) => this.state.changeSelectedModel(newModel)}
                />
                
                <div className={"optimizations-container"}>
                    <LeftOptionsMenu
                        selectedModel={this.state.selectedModel}
                        modelingType={this.state.modelingType}
                        parameters={this.state.parameters}
                    />

                    <div className={"optimization-output-main-container"}>

                    </div>

                    <RightStatisticsMenu
                        errorRates={this.state.errorRates}
                    />
                </div>
            </>
        );
    }
}

export default Optimization;