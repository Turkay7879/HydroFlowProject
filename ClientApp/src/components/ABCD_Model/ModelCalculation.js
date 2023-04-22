
import React from 'react';
import { read, utils } from 'xlsx';


class ModelCalculation extends React.Component {


    state = {
        showResult: false,
        result: {},
        Qmodelt: []
    }

    // Dosya yükleme işlemleri 
    handleFileUpload = (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            console.error("No file selected");
            return;
        }

        const reader = new FileReader();
        const file = files[0];

        reader.onload = (e) => {
            const binaryData = e.target.result;
            const data = this.convertData(binaryData);

            const result = this.calculateResult(data);
            this.setState({
                showResult: true,
                result
            }, () => {
                let Obsmm = this.state.result.Obsmm;
                let Qmodelt = this.state.result.Qmodelt;
                let T = this.state.result.T.map(modelDate => modelDate.split(".").at(2))
                console.log(`orig size: ${Obsmm.length}\toptimize size: ${Qmodelt.length}`)

                let result = {
                    type1: "Observed Streamflow",
                    actualValues: Obsmm.filter(value => value),
                    type2: "Simulated Streamflow",
                    qModelValues: Qmodelt.filter(value => value),
                    date: T
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
                this.props.onOptimizationFinished(result);
                this.props.onCalibrationScatter(scatterResult);
            });
        };

        reader.readAsBinaryString(file);
    }

    // Veri dönüşümü işlemleri
    convertData = (binaryData) => {
        const workbook = read(binaryData, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = utils.sheet_to_json(worksheet, { header: 1 });

        const headers = data[0];
        const columnData = {};
        headers.forEach((header) => {
            columnData[header] = [];
        });

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            headers.forEach((header, index) => {
                columnData[header].push(row[index]);
            });
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

        return {
            T,
            P: columnData.P,
            PET: columnData.PET,
            Obsmm: columnData.Obsmm,
            G: columnData['G(t)'],
            S: columnData['S(t)'],
            A: columnData.A,
            B: columnData.B,
            C: columnData.C,
            D: columnData.D
        };
    }

    // Hesaplama işlemleri
    calculateResult = (data) => {
        const { T, P, PET, Obsmm, G, S, A, B, C, D } = data;

        const Et = [];
        const DRt = [];
        const GRt = [];
        const Gt = [];
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

        for (let i = 1; i < T.length; i++) {
            // Adım 1
            const Wt = S[i - 1] + P[i];
            //Step 2 Yt=(Wt+B)/(2A)‐SQRT(((Wt+B)/(2A))^2‐B*Wt/A)
            const Yt = (Wt + B[0]) / (2 * A[0]) - Math.sqrt(Math.pow((Wt + B[0]) / (2 * A[0]), 2) - (B[0] * Wt) / A[0]);
            // Adım 3
            Et[i] = Yt * (1 - Math.exp(-PET[i] / B[0]))

            // Adım 4
            DRt[i] = ((1 - C[0]) * (Wt - Yt));

            // Adım 5
            GRt[i] = (C[0] * (Wt - Yt));

            Gt[i] = G[i];

            // Adım 7
            GDt[i] = (D[0] * G[i]);

            // Adım 8
            Qmodelt[i] = (DRt[i] + GDt[i]);
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
            Qmodelt
        };
    }

    calibrateFunction(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD) {
        const rmse = this.calculateRMSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("RMSE value: ", rmse);
        const nse = this.calculateNSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("NSE value: ", nse);
        let calibratedValues = {};
        calibratedValues = this.optimizeParameters(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD, 0.01, 0.5);
        return calibratedValues;
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


    createPredictionArray() {
        const predictionArray = {
            A: [],
            B: [],
            C: [],
            D: [],
        };

        predictionArray.A.push(0.5);
        predictionArray.B.push(250);
        predictionArray.C.push(0.49);
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
        var currentRMSE = this.calculateRMSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
        let upperLimit = targetRMSE+0.1;
        let lowerLimit = targetRMSE - 0.1;

        while (currentRMSE > targetRMSE || currentRMSE >= upperLimit || currentRMSE <= lowerLimit) {
            // A, B, C ve D değerlerini güncelle
            predictedA[0] = predictedA[0] - learningRate * this.calculatePartialDerivativeA(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            predictedB[0] = predictedB[0] - learningRate * this.calculatePartialDerivativeB(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            predictedC[0] = predictedC[0] - learningRate * this.calculatePartialDerivativeC(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);
            predictedD[0] = predictedD[0] - learningRate * this.calculatePartialDerivativeD(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);

            // RMSE değerini hesapla
            currentRMSE = this.calculateRMSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD);

            // lowerLimit ve upperLimit değerlerini güncelle
            lowerLimit = currentRMSE - 0.1;
            upperLimit = currentRMSE + 0.1;
        }
        console.log("rmse", currentRMSE)
        console.log("predictedA:", predictedA[0]);
        console.log("actualA:", actualA[0]);
        console.log("predictedB:", predictedB[0]);
        console.log("actualB:", actualB[0]);
        console.log("predictedC:", predictedC[0]);
        console.log("actualC:", actualC[0]);
        console.log("predictedD:", predictedD[0]);
        console.log("actualD:", actualD[0]);
    }

    render() {
        const { showResult, result } = this.state;

        return (
            <div>
                <input type="file" onChange={this.handleFileUpload} />
                {showResult && (
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Tarih</th>
                                <th>P</th>
                                <th>PET</th>
                                <th>Obsmm</th>
                                <th>Et</th>
                                <th>DRt</th>
                                <th>GRt</th>
                                <th>G </th>
                                <th>GDt</th>
                                <th>Qmodelt</th>
                            </tr>
                            </thead>
                            <tbody>
                            { /*
                                result.T.map((date, index) => (
                                <tr key={index}>
                                    <td>{date}</td>
                                    <td>{result.P[index]}</td>
                                    <td>{result.PET[index]}</td>
                                    <td>{result.Obsmm[index]}</td>
                                    <td>{result.Et[index]}</td>
                                    <td>{result.DRt[index]}</td>
                                    <td>{result.GRt[index]}</td>
                                    <td>{result.G[index]} </td>
                                    <td>{result.GDt[index]}</td>
                                    <td>{result.Qmodelt[index]}</td>
                                </tr>
                            ))*/}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}
export default ModelCalculation;