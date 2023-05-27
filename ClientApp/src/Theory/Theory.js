import React from 'react';
import './Theory.css';

class Theory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="theory-container">
                    <h2 className="theory-title larger-title">ABCD Water Balance Model</h2>

                    <br />
                    <br />
                    <p>
                        The ABCD water balance model is a hydrologic model designed to simulate streamflow in response to precipitation and potential evapotranspiration. It consists of two storage compartments: soil moisture and groundwater. The model calculates various fluxes such as surface runoff, recharge, and discharge to estimate the total streamflow.
                    </p>

                    <img
                        src={process.env.PUBLIC_URL + '/model_pic.png'}
                        alt="Model"
                        className="model-image"
                    />

                    <div className="section">
                        <h3>Storage Compartments:</h3>
                        <ul>
                            <li>Soil Moisture: Represents the water content in the upper soil layer.</li>
                            <li>Groundwater: Represents the water stored below the soil layer.</li>
                        </ul>
                    </div>

                    <div className="section">
                        <h3>Fluxes:</h3>
                        <ul>
                            <li>Runoff: The portion of water that flows over the soil surface due to excess precipitation.</li>
                            <li>Recharge: The process of water percolating from the soil layer to the groundwater.</li>
                            <li>Discharge: The release of water from the groundwater into the stream.</li>
                            <li>Precipitation: The input of water from rainfall or snowfall.</li>
                            <li>Evapotranspiration (ET): The combined process of water evaporation from the soil and transpiration from plants.</li>
                            <li>Streamflow: The total volume of water flowing in the stream, which is the sum of surface runoff and groundwater discharge.</li>
                        </ul>
                    </div>

                    <img
                        src={process.env.PUBLIC_URL + '/model_pic2.jpg'}
                        alt="Model"
                        className="model-image"
                    />

                    <div className="section">
                        <h3>Parameters:</h3>
                        <p>The ABCD model incorporates four parameters that influence its behavior:</p>
                        <ul>
                            <li>Parameter a: Controls the amount of runoff and recharge when the soils are under-saturated.</li>
                            <li>Parameter b: Determines the saturation level of the soils.</li>
                            <li>Parameter c: Defines the ratio of groundwater recharge to surface runoff.</li>
                            <li>Parameter d: Regulates the rate of groundwater discharge.</li>
                        </ul>
                    </div>

                    <div className="section">
                        <h3>Simulation Formulas:</h3>
                        <p>The ABCD model follows a series of simulation steps and formulas to estimate the storage compartments and fluxes:</p>
                        <ol>
                            <li>Calculate Wt = St-1 + Pt</li>
                            <li>Calculate Yt = (Wt + B) / (2A) - SQRT(((Wt + B) / (2A))^2 - B * Wt / A)</li>
                            <li>Calculate St = Yt * EXP(-PETt / B)</li>
                            <li>Calculate Et = Yt * (1 - EXP(-PETt / B))</li>
                            <li>Calculate DRt = (1 - C) * (Wt - Yt)</li>
                            <li>Calculate GRt = C * (Wt - Yt)</li>
                            <li>Calculate Gt = (1 / (1 + D)) * (Gt-1 + GRt)</li>
                            <li>Calculate GDt = D * Gt</li>
                            <li>Calculate Qmodelt = DRt + GDt</li>
                        </ol>
                        <p>Note: A, B, C, and D are parameters provided by the user and calibrated accordingly. St and Gt represent the storage compartments for soil moisture and groundwater, respectively.</p>
                    </div>
                </div>
            </>
        );
    }
}

export default Theory;
