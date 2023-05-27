import React from "react";
import ModelSelectorPane from "./ModelSelectorPane";
import LeftOptionsMenu from "./LeftOptionsMenu";
import RightStatisticsMenu from "./RightStatisticsMenu";
import LineChart from "../Charts/LineChart";
import ScatterChart from "../Charts/ScatterChart";
import OptimizationRemote from "./flux/remote/OptimizationRemote";
import SessionsRemote from "../Constants/flux/remote/SessionsRemote";
import ModelsRemote from "../Models/flux/ModelsRemote";
import Swal from "sweetalert2";
import {Navigate} from "react-router-dom";
import { read, utils } from 'xlsx';

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
            parameters: null,
            origParamList: null,
            errorRates: {
                optimization: {
                    rmse: null,
                    nse: null,
                    qModelDeviation: null,
                    obsmmDeviation: null,
                    qModelSkewness: null,
                    obsmmSkewness: null,
                    qModelAvg: null,
                    obsmmAvg: null
                },
                verification: {
                    rmse: null,
                    nse: null,
                    qModelDeviation: null,
                    obsmmDeviation: null,
                    qModelSkewness: null,
                    obsmmSkewness: null,
                    qModelAvg: null,
                    obsmmAvg: null
                }
            },
            observedDataOptimization: null,
            predictedDataOptimization: null,
            observedDataVerification: null,
            predictedDataVerification: null,
            scatterDataOptimization: null,
            scatterDataVerification: null,
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
                samples: null,
                errorRates: {
                    optimization: {
                        rmse: null,
                        nse: null,
                        qModelDeviation: null,
                        obsmmDeviation: null,
                        qModelSkewness: null,
                        obsmmSkewness: null,
                        qModelAvg: null,
                        obsmmAvg: null
                    },
                    verification: {
                        rmse: null,
                        nse: null,
                        qModelDeviation: null,
                        obsmmDeviation: null,
                        qModelSkewness: null,
                        obsmmSkewness: null,
                        qModelAvg: null,
                        obsmmAvg: null
                    }
                },
                observedDataOptimization: null,
                predictedDataOptimization: null,
                observedDataVerification: null,
                predictedDataVerification: null,
                scatterDataOptimization: null,
                scatterDataVerification: null,
            })
        }));
        let session = JSON.parse(window.localStorage.getItem("hydroFlowSession"));
        OptimizationRemote.getModelParameters({"Model_Id": model.id, "User_Id": session.sessionUserId}).then(response => response.json().then(parameterData => {
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

    convertData = () => {
        const workbook = read(this.state.modelData, { type: "base64" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = utils.sheet_to_json(worksheet, { header: 1 });

        const headers = data[0];
        const columnData = {};
        headers.forEach((header) => {
            columnData[header] = [];
        });

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            let isUndefined = false;

            for(let j = 0; j < row.length; j++){
                if(row[j] === undefined){
                    isUndefined = true;
                    break;
                }
            }

            if(!isUndefined){
                headers.forEach((header, index) => {
                    columnData[header].push(row[index]);
                });
            }
        }

        // Check for undefined round #2
        const p = [];
        const pet = [];
        const obsmm = [];
        columnData.Obsmm.forEach((item, index) => {
            if (typeof(item) !== 'undefined') {
                p.push(columnData.P[index]);
                pet.push(columnData.PET[index]);
                obsmm.push(columnData.Obsmm[index]);
            }
        });

        return {
            P: p,
            PET: pet,
            Obsmm: obsmm
        }
    }
    
    runOptimization = (percentage) => {
        let { P, PET, Obsmm } = this.convertData();

        let payload = {
            Model_Id: this.state.selectedModel.id,
            Model_Type: this.state.modelingType,
            Parameters: JSON.stringify(this.state.parameters),
            P: JSON.stringify(P),
            PET: JSON.stringify(PET),
            Obsmm: JSON.stringify(Obsmm),
            Optimization_Percentage: percentage
        }

        this.setState({ runningOptimization: true }, () => {
            OptimizationRemote.optimize(payload).then(response => {
                if (response.status === 400) {
                    Swal.fire({
                        title: "Incorrect Request",
                        text: `An incorrect request was sent to server.`,
                        icon: "error"
                    });
                } else if (response.ok) {
                    response.json().then(data => this.handleOptimizationResult(data));
                }
            });
        });
    }

    handleOptimizationResult = (data) => {
        const optimizedParams = {
            ...this.state.parameters,
            a: Number(data.optimized_Parameters.A).toFixed(2),
            b: Number(data.optimized_Parameters.B).toFixed(0),
            c: Number(data.optimized_Parameters.C).toFixed(2),
            d: Number(data.optimized_Parameters.D).toFixed(2)           
        }

        const statistics = {
            optimization: {
                rmse: data.statistics_Optimization.RMSE,
                nse: data.statistics_Optimization.NSE,
                qModelDeviation: data.statistics_Optimization.DeviationPredicted,
                obsmmDeviation: data.statistics_Optimization.DeviationObserved,
                qModelSkewness: data.statistics_Optimization.SkewnessPredicted,
                obsmmSkewness: data.statistics_Optimization.SkewnessObserved,
                qModelAvg: data.statistics_Optimization.AveragePredicted,
                obsmmAvg: data.statistics_Optimization.AverageObserved
            },
            verification: {
                rmse: data.statistics_Verification.RMSE,
                nse: data.statistics_Verification.NSE,
                qModelDeviation: data.statistics_Verification.DeviationPredicted,
                obsmmDeviation: data.statistics_Verification.DeviationObserved,
                qModelSkewness: data.statistics_Verification.SkewnessPredicted,
                obsmmSkewness: data.statistics_Verification.SkewnessObserved,
                qModelAvg: data.statistics_Verification.AveragePredicted,
                obsmmAvg: data.statistics_Verification.AverageObserved
            }
        };

        const optimizationScatter = [];
        const verificationScatter = [];

        data.scatter_Data_Optimization.forEach((item) => {
            let x = Number(item[0]);
            let y = Number(item[1]).toFixed(2);
            optimizationScatter.push([x, y]);
        });

        data.scatter_Data_Verification.forEach((item) => {
            let x = Number(item[0]);
            let y = Number(item[1]).toFixed(2);
            verificationScatter.push([x, y]);
        });

        this.onParameterChange(optimizedParams);
        this.setState({
            runningOptimization: false,
            errorRates: statistics,
            observedDataOptimization: data.observed_Data_Optimization.map(item => Number(item).toFixed(0)),
            predictedDataOptimization: data.predicted_Data_Optimization.map(item => Number(item).toFixed(0)),
            observedDataVerification: data.observed_Data_Verification.map(item => Number(item).toFixed(0)),
            predictedDataVerification: data.predicted_Data_Verification.map(item => Number(item).toFixed(0)),
            scatterDataOptimization: optimizationScatter,
            scatterDataVerification: verificationScatter,
        });
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
                    <div style={{flexDirection : "column" }}>

                        <LeftOptionsMenu
                            selectedModel={this.state.selectedModel}
                            modelingType={this.state.modelingType}
                            parameters={this.state.parameters}
                            originalParameters={this.state.origParamList}
                            onStartOptimize={(percentage) => this.runOptimization(percentage)}
                            onParameterChange={this.onParameterChange}
                            isOptimizationRunning={this.state.runningOptimization}
                        />
                        {
                            this.state.observedDataOptimization && this.state.predictedDataOptimization
                            && this.state.scatterDataOptimization && <div className={"view-statics-btn"}>
                              
                            </div>
                        }
                    </div>
                    <div className={"optimization-output-main-container"}>
                        {this.state.observedDataOptimization && this.state.predictedDataOptimization
                            && this.state.scatterDataOptimization && (
                                <h4 style={{marginBottom: "20px"}}>Optimization Results</h4>
                            )}
                        <div style={{ display: "flex" }}>
                            {this.state.observedDataOptimization && this.state.predictedDataOptimization && (
                                <div>
                                    <LineChart
                                        type1="Observed Streamflow"
                                        actual={this.state.observedDataOptimization}
                                        type2="Predicted Streamflow"
                                        predicted={this.state.predictedDataOptimization}
                                        date={null}
                                    />

                                </div>
                            )}
                            {this.state.scatterDataOptimization && (
                                <ScatterChart samples={this.state.scatterDataOptimization} />
                            )}
                        </div>
                        {this.state.observedDataVerification && this.state.predictedDataVerification
                            && this.state.scatterDataVerification && (
                                <h4 style={{marginBottom: "20px"}}>Verification Results</h4>
                            )}
                        <div style={{display: "flex"}}>
                            {
                                this.state.observedDataVerification && this.state.predictedDataVerification && <>
                                    <LineChart
                                        type1="Observed Streamflow"
                                        actual={this.state.observedDataVerification}
                                        type2="Predicted Streamflow"
                                        predicted={this.state.predictedDataVerification}
                                        date={null}/>
                                </>
                            }
                            {
                                this.state.scatterDataVerification && <ScatterChart
                                    samples={this.state.scatterDataVerification}/>
                            }
                        </div>
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