
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
            const workbook = read(binaryData, { type: "binary" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = utils.sheet_to_json(worksheet, { header: 1 });

            // Sütun adlarını alın 
            const headers = data[0];

            // Veri sütunlarını bir dizi olarak gruplandırın 
            const columnData = {};
            headers.forEach((header) => {
                columnData[header] = [];
            });

            // Verileri ilgili sütuna ekleyin 
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                headers.forEach((header, index) => {
                    columnData[header].push(row[index]);
                });
            }

            console.log(columnData);

            // Tarihleri Date objesine dönüştür 
            const T = [];
            const dates =[];
            for (let i = 0; i < columnData.Tarih.length; i++) {
                T.push(new Date(columnData.Tarih[i]));
            }
            const G = columnData['G(t)'];

            const P = columnData.P;
            const PET = columnData.PET;
            const Obsmm = columnData.Obsmm;
            const S = columnData['S(t)'];

            const A = columnData.A;
            const B = columnData.B;
            const C = columnData.C;
            const D = columnData.D;

            const Et = [];
            const DRt = [];
            const GRt = [];
            const Gt = [];
            const GDt = [];
            const Qmodelt = [];

            ////calibrasyon 

            // Parametreleri tanımlayın 
            const actualA = columnData.A;
            const actualB = columnData.B;
            const actualC = columnData.C;
            const actualD = columnData.D;
            console.log('ActualA',actualA);
            // Tahmin edilen parametreleri tanımlayın 
            let paramA = [];
            let paramB = [];
            let paramC = [];
            let paramD = [];
            //////////

            //burayı internette gördüğüm için bu şekilde kendim veri seti vererek rmse ve nse hesaplanıyor burayı hocaya sorduğumda doğru dedi ama güvenemedim yine araştırırız.
            //bu dizilerin aralığını hoca toplantıda söyledi.
            paramA.push(0.1, 0.2, 0.3,0.4,0.5,0.6);///1 den küçük
            paramB.push(4, 5, 6, 7, 8, 9);//1 den büyük 100-200
            paramC.push(0.1, 0.5, 0.3, 0.14, 0.5, 0.6);//1 den küçük
            paramD.push(0.7, 0.5, 0.6, 0.7, 0.18, 0.9);//1 den küçük
            ///////////////

            console.log('paramA', paramA);
            ////calibrasyon 
            const calibratedValues = this.calibrateFunction(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
            paramA = calibratedValues.paramA;
            paramB = calibratedValues.paramB;
            paramC = calibratedValues.paramC;
            paramD = calibratedValues.paramD;


            console.log('paramA',paramA);

            for (let i = 1; i < T.length; i++) {
                // Adım 1 
                const Wt = S[i - 1] + P[i];
                console.log('Wt:', Wt);

                // Adım 2

                //Step 2 Yt=(Wt+B)/(2A)‐SQRT(((Wt+B)/(2A))^2‐B*Wt/A)
                const Yt = (Wt + B[i]) / (2 * A[i]) - Math.sqrt(Math.pow((Wt + B[i]) / (2 * A[i]), 2) - (B[i] * Wt) / A[i]);

                console.log(Yt, Wt, B, A); // Check the values of Yt, Wt, B, and A
                console.log('Yt:', Yt);
                console.log('Wt:', Wt);
                console.log('B:', B[i]);
                console.log('A:', A[i]);

                console.log('Et:', Et[i]);
                // Adım 3
                Et[i] = Yt * (1 - Math.exp(-PET[i] / B[i]))
                console.log('Et:', Et[i]);

                // Adım 4
                DRt[i] = ((1 - C[i]) * (Wt - Yt));
                console.log('DRt:', DRt[i]);

                // Adım 5
                GRt[i] = (C[i] * (Wt - Yt));
                console.log('GRt:', GRt[i]);

                Gt[i] = G[i];

                // Adım 7
                GDt[i] = (D[i] * G[i]);
                console.log('GDt:', GDt[i]);

                // Adım 8
                Qmodelt[i] = (DRt[i] + GDt[i]);
                console.log('Qmodelt:', Qmodelt[i]);
            }
            this.setState({
                showResult: true,
                result: {
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
                }
            }, () => {
                let result = {
                    type1: "Observed Streamflow",
                    actualValues: Obsmm.filter(value => value),
                    type2: "Simulated Streamflow",
                    qModelValues: Qmodelt.filter(value => value),
                    date: [1991, 1992, 1993, 1994, 1995, 1996] //FIXME
                };

                //const sampleArr = []
                //for (let i = 0; i < Obsmm.length; i++) {
                //   sampleArr[i] = [Obsmm[i], Qmodelt[i]]
                //}
                //FIXME
                let scatterResult = {
                    //samples: sampleArr
                    samples: [[1,2]]
                }
                console.log("result", result)
                this.props.onOptimizationFinished(result);
                //this.props.onCalibrationScatter(scatterResult);
            });
        };

        reader.readAsBinaryString(file);
    }

    calibrateFunction(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD) {
        let paramAA = [];
        let paramBB = [];
        let paramCC = [];
        let paramDD = [];
        paramAA.push(0.5, 0.6, 0.7, 0.8, 0.5, 0.6);///1 den küçük
        paramBB.push(45, 50, 60, 7, 8, 9);//1 den büyük 100-200
        paramCC.push(0.10, 0.58, 0.3, 0.14, 0.5, 0.65);//1 den küçük
        paramDD.push(0.7, 0.5, 0.69, 0.7, 0.189, 0.99);//1 den küçük
        const rmse = this.calculateRMSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("RMSE value: ", rmse);
        const nse = this.calculateNSE(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD);
        console.log("NSE value: ", nse);
        let calibratedValues = {};
        calibratedValues = this.optimizeParameters(paramA, paramB, paramC, paramD, actualA, actualB, actualC, actualD,  0.01,  1000,  1e-5);
        console.log("Calibrated values: ", calibratedValues.paramA);
        return calibratedValues;
    }
    average(actualA, actualB, actualC, actualD) {
        let sum = 0;

        for (let i = 0; i < actualA.length; i++) {
            sum += actualA[i];
            sum += actualB[i];
            sum += actualC[i];
            sum += actualD[i];
        }

        return sum / (actualA.length * 4);
    }

    calculateRMSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD ) {

        console.log("predictedA:", predictedA);
        console.log("actualA:", actualA);
        console.log("predictedB:", predictedB);
        console.log("actualB:", actualB);
        console.log("predictedC:", predictedC);
        console.log("actualC:", actualC);
        console.log("predictedD:", predictedD);
        console.log("actualD:", actualD);

        let sumSquare = 0.0;
        for (let i = 0; i < predictedA.length; i++) {
            sumSquare += (predictedA[i] - actualA[i]) ** 2;
            sumSquare += (predictedB[i] - actualB[i]) ** 2;
            sumSquare += (predictedC[i] - actualC[i]) ** 2;
            sumSquare += (predictedD[i] - actualD[i]) ** 2;
        }
        const n = predictedA.length;
        console.log("sumSquare:", sumSquare);
        console.log("n:", n);
        return Math.sqrt(sumSquare / n);
    }

    calculateNSE(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD) {
        let sumSquare = 0.0;
        let actualSumSquare = 0.0;

        for (let i = 0; i < predictedA.length; i++) {
            sumSquare += (predictedA[i] - actualA[i]) ** 2;
            sumSquare += (predictedB[i] - actualB[i]) ** 2;
            sumSquare += (predictedC[i] - actualC[i]) ** 2;
            sumSquare += (predictedD[i] - actualD[i]) ** 2;
        }
        const actualMean = this.average(actualA, actualB, actualC, actualD);
        for (let j = 0; j < actualA.length; j++) {
            actualSumSquare += (actualA[j] - actualMean) ** 2;
            actualSumSquare += (actualB[j] - actualMean) ** 2;
            actualSumSquare += (actualC[j] - actualMean) ** 2;
            actualSumSquare += (actualD[j] - actualMean) ** 2;
        }

        return 1 - (sumSquare / actualSumSquare);
    }
    ///burada predict değerleri günceller acaba actual array üzerinde mi bir güncelleme yapılıyor? .
    optimizeParameters(predictedA, predictedB, predictedC, predictedD, actualA, actualB, actualC, actualD, learningRate = 0.01, epochs = 1000, tolerance = 1e-5) {
        let paramA = [...predictedA];
        let paramB = [...predictedB];
        let paramC = [...predictedC];
        let paramD = [...predictedD];

        const n = predictedA.length;

        let rmse = Infinity;
        for (let epoch = 0; epoch < epochs; epoch++) {
            let gradA = 0;
            let gradB = 0;
            let gradC = 0;
            let gradD = 0;

            for (let i = 0; i < n; i++) {
                const errorA = paramA[i] - actualA[i];
                const errorB = paramB[i] - actualB[i];
                const errorC = paramC[i] - actualC[i];
                const errorD = paramD[i] - actualD[i];

                gradA += 2 * errorA;
                gradB += 2 * errorB;
                gradC += 2 * errorC;
                gradD += 2 * errorD;
            }

            gradA /= n;
            gradB /= n;
            gradC /= n;
            gradD /= n;

            paramA = paramA.map(a => a - learningRate * gradA);
            paramB = paramB.map(b => b - learningRate * gradB);
            paramC = paramC.map(c => c - learningRate * gradC);
            paramD = paramD.map(d => d - learningRate * gradD);

            rmse = Math.sqrt((1 / n) * paramA.reduce((acc, a, i) => acc + Math.pow(a - actualA[i], 2), 0)
                + (1 / n) * paramB.reduce((acc, b, i) => acc + Math.pow(b - actualB[i], 2), 0)
                + (1 / n) * paramC.reduce((acc, c, i) => acc + Math.pow(c - actualC[i], 2), 0)
                + (1 / n) * paramD.reduce((acc, d, i) => acc + Math.pow(d - actualD[i], 2), 0));
            console.log("rmse optimizeggg:", rmse, paramA);

            if (rmse < tolerance) {
                break;
            }
            console.log("grad A:", gradA, gradB);

        }
        console.log("rmse optimize:", rmse, paramA);
        console.log("rmse optimize:", rmse, paramB);

        return { paramA, paramB, paramC, paramD, rmse };
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
                                {result.T.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.toLocaleDateString()}</td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}
export default ModelCalculation;