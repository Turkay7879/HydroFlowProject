import React from 'react';
import { read, utils } from 'xlsx';

class ModelCalculation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showResult: false,
            result: {},
            Qmodelt: [],
            parameters: null,
            enableOptimization: props.optimize
        }
    }
    
    componentDidMount() {
        this.setState({ 
            modelData: this.props.modelData,
            parameters: this.props.parameters
        });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.modelData !== this.props.modelData) {
            this.setState({ modelData: this.props.modelData });
        }
        if (prevProps.parameters !== this.props.parameters) {
            this.setState({ parameters: this.props.parameters });
        }
        if (prevProps.isOptimizationStarted !== this.props.isOptimizationStarted) {
            this.setState({ isOptimizationStarted: this.props.isOptimizationStarted });
        }
    }

    startOperations = () => {
        const data = this.convertData(this.state.modelData);
        const result = this.calculateResult(data);
        this.setState({
            showResult: true,
            result
        }, () => {
            let Obsmm = this.state.result.Obsmm;
            let Qmodelt = this.state.result.Qmodelt;
            let T = this.state.result.T.map(modelDate => modelDate.split(".").at(2))

            let resultToReturn = {
                type1: "Observed Streamflow",
                actualValues: Obsmm,
                type2: "Simulated Streamflow",
                qModelValues: Qmodelt.filter(value => value),
                date: T,
                rmse_Calibrate: result.final_RMSE,
                nse_Calibrate: result.final_NSE,
                statistics: result.statistics
            };

            let originalObservations = [...Obsmm];
            originalObservations.shift();
            let optimizedResults = Qmodelt.filter(res => res);
            
            const sampleArr = []
            for (let i = 0; i < originalObservations.length; i++) {
                let data = []
                data.push(Math.trunc(originalObservations.at(i)))
                data.push(Math.trunc(optimizedResults.at(i)))
                sampleArr.push(data)
            }

            let scatterResult = {
                samples: sampleArr
            }
            this.props.onOptimizationFinished(resultToReturn);
            this.props.onCalibrationScatter(scatterResult);
        });
        
        return <></>
    }

    // Veri dönüşümü işlemleri
    convertData = (modelData) => {
        const workbook = read(modelData, { type: "base64" });
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
                //console.log("row: ", row[j]);
                if(row[j] === undefined){
                    isUndefined = true;
                    break;
                }
            }

            if(!isUndefined){
                headers.forEach((header, index) => {
                    columnData[header].push(row[index]);
                    //console.log("header: ", header);
                    //console.log("excel: ", row[index]);
                });
            }

        }

        ////tarih
        const T = [];
        for (let i = 0; i < columnData.Tarih.length; i++) {
            let dateInt = columnData.Tarih[i];
            const excelSerialDate = new Date(Date.UTC(1899, 11, 30));
            const excelSerialDay = Math.floor(dateInt);
            const jsDate = new Date(excelSerialDate.getTime() + (excelSerialDay * 86400000));
            const day = ('0' + jsDate.getDate()).slice(-2);
            const month = ('0' + (jsDate.getMonth() + 1)).slice(-2);
            const year = jsDate.getFullYear();

            const formattedDate = day + '.' + month + '.' + year;
            T.push(formattedDate);
        }
        
        let param_A = [this.state.parameters.a];
        let param_B = [this.state.parameters.b];
        let param_C = [this.state.parameters.c];
        let param_D = [this.state.parameters.d];
        let param_St = [this.state.parameters.initialSt];
        let param_Gt = [this.state.parameters.initialGt];

        return {
            T,
            P: columnData.P,
            PET: columnData.PET,
            Obsmm: columnData.Obsmm,
            G: param_Gt,
            S: param_St,
            A: param_A,
            B: param_B,
            C: param_C,
            D: param_D
        };
    }

    // Hesaplama işlemleri
    calculateResult = (data) => {
        const { T, P, PET, Obsmm, G, S, A, B, C, D } = data;

        const Et = [];
        const DRt = [];
        const GRt = [];
        const GDt = [];
        const Qmodelt = [];

        const actualA = A;
        const actualB = B;
        const actualC = C;
        const actualD = D;

        // Parametre tahmini işlemleri
        let predictionArray = this.createPredictionArray();
        let paramA = predictionArray.A;
        let paramB= predictionArray.B;
        let paramC = predictionArray.C;
        let paramD = predictionArray.D;

        ////calibrasyon
        const calibratedvalues = this.calibrateFunction(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        const optimized_A = this.state.enableOptimization === true ? calibratedvalues.predictedA : actualA;
        const optimized_B = this.state.enableOptimization === true ? calibratedvalues.predictedB : actualB;
        const optimized_C = this.state.enableOptimization === true ? calibratedvalues.predictedC : actualC;
        const optimized_D = this.state.enableOptimization === true ? calibratedvalues.predictedD : actualD;
        const final_RMSE = this.state.enableOptimization === true ? calibratedvalues.currentRMSE : this.state.rmse_CalibrateOnly;
        const final_NSE = this.state.enableOptimization === true ? calibratedvalues.currentNSE : this.state.nse_CalibrateOnly;
        
        for (let i = 1; i < T.length; i++) {
            // Step 1
            const Wt = S[i - 1] + P[i];
            // Step 2
            const Yt = (Wt + optimized_B[0]) / (2 * optimized_A[0]) - Math.sqrt(Math.pow((Wt + optimized_B[0]) / (2 * optimized_A[0]), 2) - (optimized_B[0] * Wt) / optimized_A[0]);
            // Step 3
            S[i] = Yt * Math.exp(-1 * PET[i] / optimized_B[0]);
            // Step 4
            Et[i] = Yt * (1 - Math.exp(-PET[i] / optimized_B[0]))
            // Step 5
            DRt[i] = ((1 - optimized_C[0]) * (Wt - Yt));
            // Step 6
            GRt[i] = (optimized_C[0] * (Wt - Yt));
            // Step 7
            G[i] = (1 / (1 + optimized_D[0])) * (G[i - 1] + GRt[i])
            // Step 8
            GDt[i] = (optimized_D[0] * G[i]);
            // Step 9
            Qmodelt[i] = (DRt[i] + GDt[i]);
        }

        let statistics = {
            qModelDeviation: this.calculateSampleStandardDeviation(Qmodelt),
            pDeviation: this.calculateSampleStandardDeviation(P),
            etDeviation: this.calculateSampleStandardDeviation(Et),
            obsmmDeviation: this.calculateSampleStandardDeviation(Obsmm),

            qModelSkewness: this.calculateSkewness(Qmodelt),
            pSkewness: this.calculateSkewness(P),
            etSkewness: this.calculateSkewness(Et),
            obsmmSkewness: this.calculateSkewness(Obsmm),

            qModelAvg: this.calculateAverage(Qmodelt),
            pAvg: this.calculateAverage(P),
            etAvg: this.calculateAverage(Et),
            obsmmAvg: this.calculateAverage(Obsmm)
        }
        return {
            T,
            P,
            PET,
            Obsmm,
            Et,
            DRt,
            GRt,
            G,
            GDt,
            Qmodelt,
            final_RMSE,
            final_NSE,
            statistics
        };
    }

    calculateSkewness(numbers) {
        const n = numbers.length;
        const mean = numbers.reduce((acc, val) => acc + val, 0) / n;
        const standardDeviation = this.calculateSampleStandardDeviation(numbers);

        const cubedDiffsSum = numbers.reduce((acc, val) => {
            const diff = val - mean;
            return acc + Math.pow(diff, 3);
        }, 0);

        const skewness = (n / ((n - 1) * (n - 2))) * (cubedDiffsSum / Math.pow(standardDeviation, 3));

        return skewness;
    }

    calculateSampleStandardDeviation(numbers) {
        const n = numbers.length;
        const mean = numbers.reduce((acc, val) => acc + val, 0) / n;
        const squaredDiffs = numbers.reduce((acc, val) => {
            const diff = val - mean;
            return acc + diff * diff;
        }, 0);
        const variance = squaredDiffs / (n - 1);
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    }
    //Bias Formula 
    calculateBias(predictedValue, observedValue) {
        const bias = ((predictedValue - observedValue) / observedValue) * 100;
        return bias;
    }
  
    calibrateFunction(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD) {
        ///Et, P, Obsmm, Qmodelt
        const rmse = this.calculateRMSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("RMSE value: ", rmse);
        const nse = this.calculateNSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("NSE value: ", nse);
        const bias = this.calculateBias(paramB, actualB);
        console.log("bias", bias);
        const r2 = this.calculateR2(paramB, actualB);
        console.log("r2", r2);

        this.setState({
            rmse_CalibrateOnly: rmse,
            nse_CalibrateOnly: nse

        });
        if (this.state.enableOptimization === false) {return null};
        return this.optimizeParameters(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD, 0.01);
    }

    calculateR2(actual, predicted) {
        const actualMean = actual.reduce((a, b) => a + b, 0) / actual.length;
        const ssTotal = actual.reduce((a, b) => a + Math.pow((b - actualMean), 2), 0);
        const ssResidual = actual.reduce((a, b, i) => a + Math.pow((b - predicted[i]), 2), 0);
        const r2 = 1 - (ssResidual / ssTotal);
        return r2;
    }


    ///arayüz için 
    calculateAverage(numbers) {
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const average = sum / numbers.length;
        return average;
    }
   

    average(actualA, actualB, actualC, actualD) {
        let sum = 0;

        for (let i = 0; i < 1; i++) {
            sum += actualA[i];
            sum += actualB[i];
            sum += actualC[i];
            sum += actualD[i];
        }

        return sum / (1 * 4);
    }
    calculateRMSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {

        let sumSquare = 0.0;
        sumSquare += (predictedA[0] - actualA[0]) ** 2;
        sumSquare += (predictedB[0] - actualB[0]) ** 2;
        sumSquare += (predictedC[0] - actualC[0]) ** 2;
        sumSquare += (predictedD[0] - actualD[0]) ** 2;

        const n = 4;
        const meanSquare = sumSquare / n;
        const rmse = Math.sqrt(meanSquare);
        return rmse;
    }

    calculateRMSE2(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {

        let sumSquare = 0.0;
        sumSquare += (predictedA - actualA) ** 2;
        sumSquare += (predictedB - actualB) ** 2;
        sumSquare += (predictedC - actualC) ** 2;
        sumSquare += (predictedD - actualD) ** 2;

        const n = 4;
        const meanSquare = sumSquare / n;
        const rmse = Math.sqrt(meanSquare);
        return rmse;
    }
    
    createPredictionArray() {
        const predictionArray = {
            A: [],
            B: [],
            C: [],
            D: [],
        };

        predictionArray.A.push(0.9);
        predictionArray.B.push(100);
        predictionArray.C.push(0.1);
        predictionArray.D.push(0.51);

        return predictionArray;
    }
    calculateNSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        let sumSquare = 0.0;
        let actualSumSquare = 0.0;

        sumSquare += (predictedA[0] - actualA[0]) ** 2;
        sumSquare += (predictedB[0] - actualB[0]) ** 2;
        sumSquare += (predictedC[0] - actualC[0]) ** 2;
        sumSquare += (predictedD[0] - actualD[0]) ** 2;

        const actualMean = (actualA[0] + actualB[0] + actualC[0] + actualD[0]) / 4.0;
        actualSumSquare += (actualA[0] - actualMean) ** 2;
        actualSumSquare += (actualB[0] - actualMean) ** 2;
        actualSumSquare += (actualC[0] - actualMean) ** 2;
        actualSumSquare += (actualD[0] - actualMean) ** 2;

        return 1 - (sumSquare / actualSumSquare);
    }
    calculatePartialDerivativeB(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        var error = predictedB[0] - actualB[0];
        var partialDerivative = 2 * error;
        return partialDerivative;
    }

    calculatePartialDerivativeC(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        var error = predictedC[0] - actualC[0];
        var partialDerivative = 2 * error;
        return partialDerivative;
    }

    calculatePartialDerivativeD(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        var error = predictedD[0] - actualD[0];
        var partialDerivative = 2 * error;
        return partialDerivative;
    }

    calculatePartialDerivativeA(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        var error = predictedA[0] - actualA[0];
        var partialDerivative = 2 * error;
        return partialDerivative;
    }

    optimizeParameters(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD, learningRate, targetRMSE) {
        let currentRMSE = this.calculateRMSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
        console.log("currentRMSE:", currentRMSE);
        let currentNSE = null;

        let delta = Number.MAX_SAFE_INTEGER;
        let prevDelta = Number.MAX_SAFE_INTEGER;
        let iteration = 0;
        const maxIterations = 1000;
        const deltaThreshold = 0.001;
        const maxDeltaConvergenceIterations = 10;

        while (delta > deltaThreshold) {
            // A, B, C ve D değerlerini güncelle
            const partialDerivativeA = this.calculatePartialDerivativeA(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            const partialDerivativeB = this.calculatePartialDerivativeB(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            const partialDerivativeC = this.calculatePartialDerivativeC(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            const partialDerivativeD = this.calculatePartialDerivativeD(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            const newPredictedA = predictedA - learningRate * partialDerivativeA;
            const newPredictedB = predictedB - learningRate * partialDerivativeB;
            const newPredictedC = predictedC - learningRate * partialDerivativeC;
            const newPredictedD = predictedD - learningRate * partialDerivativeD;

            // RMSE değerini hesapla
            const newRMSE = this.calculateRMSE2(newPredictedA, newPredictedB, newPredictedC, newPredictedD, actualA, actualB, actualC, actualD);
            const newNSE = this.calculateNSE(newPredictedA, newPredictedB, newPredictedC, newPredictedD, actualA, actualB, actualC, actualD);

            // Delta değerini hesapla
            delta = Math.abs(predictedA - newPredictedA) + Math.abs(predictedB - newPredictedB) + Math.abs(predictedC - newPredictedC) + Math.abs(predictedD - newPredictedD);

            // Eğer delta eşik değerinin altında ise ya da önceki iterasyonlarda delta değeri yeterince azalmışsa optimizasyonu durdur
            if (delta < deltaThreshold || (iteration > maxDeltaConvergenceIterations && delta >= prevDelta)) {
                console.log("Optimization converged after " + iteration + "iterations.Delta value: " + delta);
                break;
            }    // Yeni parametre değerlerini kaydet
            predictedA[0] = newPredictedA;
            predictedB[0] = newPredictedB;
            predictedC[0] = newPredictedC;
            predictedD[0] = newPredictedD;

            // RMSE/NSE değerini güncelle
            currentRMSE = newRMSE;
            currentNSE = newNSE;

            // Delta değerini kaydet
            prevDelta = delta;

            iteration++;

            if (iteration >= maxIterations) {
                console.log("Maximum iterations reached");
                break;
            }
        }

        console.log("Optimization completed after " + iteration + " iterations. Final RMSE: " + currentRMSE);
        return { currentRMSE, currentNSE, predictedA, predictedB, predictedC, predictedD };
    }
   
    render() {
        return <>
            { this.state.isOptimizationStarted && this.startOperations() }
        </>
    }
}
export default ModelCalculation;