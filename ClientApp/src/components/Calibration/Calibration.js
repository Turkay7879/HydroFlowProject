import React from "react";
import ModelSelectorPane from "./ModelSelectorPane";
import LeftOptionsMenu from "./LeftOptionsMenu";
import RightStatisticsMenu from "./RightStatisticsMenu";
import LineChart from "../Charts/LineChart";
import ScatterChart from "../Charts/ScatterChart";
import ModelCalculation from "../ABCD_Model/ModelCalculation";
import CalibrationRemote from "./flux/remote/CalibrationRemote";
import SessionsRemote from "../Constants/flux/remote/SessionsRemote";
import Swal from "sweetalert2";
import {Navigate} from "react-router-dom";
import ModelsRemote from "../Models/flux/ModelsRemote";
import "./Calibration.css";

class Calibration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingPage: true,
            validSessionPresent: false,
            selectedModel: null,
            userModels: null,
            modelData: null,
            modelingType: "ABCD",
            parameters: null,
            origParamList: null,
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
                        CalibrationRemote.getModelsOfUser(session).then(response => {
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
            errorRates: {
                rmse: result.rmse_Calibrate,
                nse: result.nse_Calibrate,
                ...result.statistics
            },
            runningOptimization: false
        });
    }

    onCalibrationScatter = (result) => {
        this.setState({
            samples: result.samples
        });
    }
    
    onParameterChange = (newParameters) => {
        this.setState({ parameters: newParameters });
    }

    changeSelectedModel = (event) => {
        if (event.target.value === "SelectModelOption") { return; }
        const model = JSON.parse(event.target.value);
        ModelsRemote.downloadModelData(model.id).then(response => response.json().then(modelData => {
            const dataBase64 = modelData.modelFile;
            this.setState({
                selectedModel: model,
                modelData: dataBase64,
                actualObsmmValues: null,
                predictedQmodelValues: null,
                samples: null
            })
        }));
        let session = JSON.parse(window.localStorage.getItem("hydroFlowSession"));
        CalibrationRemote.getModelParameters({"Model_Id": model.id, "User_Id": session.sessionUserId}).then(response => response.json().then(parameterData => {
            const modelingType = parameterData.modelingType;
            const parameters = this.getParameters(parameterData.parameters, modelingType);
            this.setState({
                modelingType: modelingType,
                parameters: parameters,
                origParamList: parameterData.parameters
            });
        }));
    }
    
    getParameters = (parameters, modelingType) => {
        if (modelingType === "ABCD") {
            return {
                a: (parameters.find(p => p.model_Param_Name === "a")).model_Param,
                b: (parameters.find(p => p.model_Param_Name === "b")).model_Param,
                c: (parameters.find(p => p.model_Param_Name === "c")).model_Param,
                d: (parameters.find(p => p.model_Param_Name === "d")).model_Param,
                initialSt: (parameters.find(p => p.model_Param_Name === "initialSt")).model_Param,
                initialGt: (parameters.find(p => p.model_Param_Name === "initialGt")).model_Param
            };
        }
        return null;
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
                
                <div className={"calibrations-container"}>
                    <LeftOptionsMenu
                        selectedModel={this.state.selectedModel}
                        modelingType={this.state.modelingType}
                        parameters={this.state.parameters}
                        originalParameters={this.state.origParamList}
                        onStartOptimize={this.runOptimization}
                        onParameterChange={this.onParameterChange}
                        isOptimizationRunning={this.state.runningOptimization}
                    />

                    <div className={"calibration-output-main-container"}>
                        <ModelCalculation
                            modelData={this.state.modelData}
                            parameters={this.state.parameters}
                            isOptimizationStarted={this.state.runningOptimization}
                            onOptimizationFinished={this.onOptimizationFinished}
                            optimize={false}
                            onCalibrationScatter={this.onCalibrationScatter}/>
                        {
                            this.state.actualObsmmValues && this.state.predictedQmodelValues && <LineChart
                                type1={this.state.type1}
                                actual={this.state.actualObsmmValues}
                                type2={this.state.type2}
                                predicted={this.state.predictedQmodelValues}
                                date={this.state.date}/>
                        }
                        {
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

export default Calibration;