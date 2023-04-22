import React from "react";
import ModelSelectorPane from "./ModelSelectorPane";
import LeftOptionsMenu from "./LeftOptionsMenu";
import RightStatisticsMenu from "./RightStatisticsMenu";
import LineChart from "../Charts/LineChart";
import ScatterChart from "../Charts/ScatterChart";
import ModelCalculation from "../ABCD_Model/ModelCalculation";
import OptimizationRemote from "./flux/remote/OptimizationRemote";
import SessionsRemote from "../Constants/flux/remote/SessionsRemote";
import Swal from "sweetalert2";
import {Navigate} from "react-router-dom";
import ModelsRemote from "../Models/flux/ModelsRemote";

class Optimization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingPage: true,
            validSessionPresent: false,
            selectedModel: null,
            userModels: null,
            modelData: null,
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
            },
            actualObsmmValues: null,
            predictedQmodelValues: null,
            samples: null,
            runningOptimization: false
        };
    }
    
    componentDidMount() {
        this.checkPermissions();
    }

    checkPermissions = () => {
        let session = window.localStorage.getItem("hydroFlowSession");
        if (session !== null) {
            SessionsRemote.validateSession(session, (status) => {
                if (status) {
                    this.setState({ 
                        validSessionPresent: true,
                        loadingPage: false
                    }, () => {
                        // Fetch models
                        OptimizationRemote.getModelsOfUser(session).then(response => {
                            if (response.status === 200) {
                                response.json().then(modelList => {
                                    this.setState({ userModels: modelList });
                                });
                            }
                        });
                    });
                } else {
                    window.localStorage.removeItem("hydroFlowSession");
                    SessionsRemote.logoutUser(session).then(response => {
                        Swal.fire({
                            title: "Session Expired",
                            text: `Your session has expired. Login required for this page.`,
                            icon: "warning"
                        }).then(() => {
                            this.setState({
                                loadingPage: false,
                                validSessionPresent: false
                            });
                        });
                    });
                }
            });
        } else {
            this.setState({ loadingPage: false });
        }
    }

    onOptimizationFinished = (result) => {
        this.setState({
            type1: result.type1,
            actualObsmmValues: result.actualValues.map(value => Math.trunc(value)),
            type2: result.type2,
            predictedQmodelValues: result.qModelValues.map(value => Math.trunc(value)),
            date: result.date.map(value => value),
            runningOptimization: false
        });
    }

    onCalibrationScatter = (result) => {
        this.setState({
            samples: result.samples
        });
    }

    changeSelectedModel = (event) => {
        const model = JSON.parse(event.target.value);
        ModelsRemote.downloadModelData(model.id).then(response => response.json().then(modelData => {
            const dataBase64 = modelData.modelFile;
            this.setState({
                selectedModel: model,
                modelData: dataBase64
            })
        }))
    }
    
    runOptimization = () => {
        this.setState({ runningOptimization: true });
    }
    
    render() {
        return this.state.loadingPage ? <></> : 
            !this.state.validSessionPresent ? <Navigate to={"/login"}/> : (
            <>
                <ModelSelectorPane
                    selectedModel={this.state.selectedModel}
                    userModelList={this.state.userModels}
                    onSelectModel={(newModel) => this.changeSelectedModel(newModel)}
                />
                
                <div className={"optimizations-container"}>
                    <LeftOptionsMenu
                        selectedModel={this.state.selectedModel}
                        modelingType={this.state.modelingType}
                        parameters={this.state.parameters}
                        onStartOptimize={this.runOptimization}
                        isOptimizationRunning={this.state.runningOptimization}
                    />

                    <div className={"optimization-output-main-container"}>
                        <ModelCalculation
                            modelData={this.state.modelData}
                            isOptimizationStarted={this.state.runningOptimization}
                            onOptimizationFinished={this.onOptimizationFinished}
                            onCalibrationScatter={this.onCalibrationScatter}/>
                        {
                            this.state.actualObsmmValues && this.state.predictedQmodelValues && <LineChart
                                type1={this.state.type1}
                                actual={this.state.actualObsmmValues}
                                type2={this.state.type2}
                                predicted={this.state.predictedQmodelValues}
                                date={this.state.date}/>
                        }{
                        this.state.samples &&  <ScatterChart
                            samples={this.state.samples}/>
                    }
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