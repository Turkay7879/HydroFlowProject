import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Buffer } from 'buffer';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import ModelsRemote from '../flux/ModelsRemote';

class ModelDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        // Initialize the state
        this.state = {
            showModal: props.showModal, // Whether the modal should be shown
            model: props.model, // Model object
            details: {
                modelName: "", // Name of the model
                updateDate: "", // Date of the last update
                version: 0, // Version number
                modelType: "", // Type of the model
                parameters: null, // Array of model parameters
                userName: "", // Name of the creator
                userMail: "" // Email of the creator
            },
            permDownload: props.permDownload // Flag indicating if download is permitted
        };
    }

    componentDidMount() {
        // Get the user ID from the session if available
        let session = window.localStorage.getItem("hydroFlowSession");
        let userId = 0;
        if (session) {
            let sessionObject = JSON.parse(session);
            userId = sessionObject.sessionUserId;
        }
        // Retrieve the model details from the server
        ModelsRemote.getDetailsOfModel({ modelId: this.state.model.id, userId: userId }).then(response => {
            if (response.ok) {
                response.json().then(detailsData => {
                    let details = this.state.details;
                  // Extract the necessary details from the response
                    details.modelName = detailsData.latestDetails.modelName;
                    var date = new Date(detailsData.latestDetails.updateDate);
                    date.setUTCHours(date.getUTCHours() + 3);
                    details.updateDate = date.toUTCString();
                    details.version = detailsData.latestDetails.version;
                    details.percentage = detailsData.latestDetails.percentage;
                    details.modelType = detailsData.modelType;
                    details.parameters = detailsData.parameters;
                    details.userName = detailsData.user.name;
                    details.userMail = detailsData.user.email;
                    details.dateRange = detailsData.latestDetails.dateRange;

                    this.setState({ details: details });
                });
            } else if (response.status === 412) {
                response.json().then(errMsg => {
                  // Display an error message and close the modal
                    Swal.fire({
                        title: "Error",
                        text: errMsg,
                        icon: "error"
                    }).then(() => this.setState({ showModal: false }, () => this.props.onDismiss(null)));
                });
            } else {
                   // Display a generic error message and close the modal
                Swal.fire({
                    title: "Error",
                    text: "An error occured while retrieving simulation details.",
                    icon: "error"
                }).then(() => this.setState({ showModal: false }, () => this.props.onDismiss(null)));
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      // Update the permDownload state when the prop changes
        if(prevProps.permDownload !== this.props.permDownload){
            this.setState({permDownload: this.props.permDownload});
        }
    }

    downloadModelData = () => {
            // Download the model data from the server
        ModelsRemote.downloadModelData(this.state.model.id).then(response => response.json().then(model => {
            let data = model.modelFile;
              // Convert the base64 encoded data to bytes
            const bytes = Buffer.from(data, 'base64')
               // Create a blob from the bytes
            const blob = new Blob([bytes])
            // Create a link element and set the blob as the href
            const link = document.createElement('a');
              // Set the filename for the download
            link.href = window.URL.createObjectURL(blob);
            link.download = "observed-data.xlsx";
              // Simulate a click on the link to start the download
            link.click();
             // Remove the link element
            link.remove();
        }))
    }

     // This function takes in a parameter name and returns a description for that parameter.
    // It uses a switch statement to match the parameter name with its corresponding description.
    getParameterDescription = (name) => {
        let paramDescription = '';
        switch (name) {
            case 'a':
                paramDescription = 'A';
                break;
            case 'b':
                paramDescription = 'B';
                break;
            case 'c':
                paramDescription = 'C';
                break;
            case 'd':
                paramDescription = 'D';
                break;
            case 'initialSt':
                paramDescription = "Initial Soil Moisture";
                break;
            case 'initialGt':
                paramDescription = "Initial Groundwater";
                break;
            default:
                break;
        }
        return paramDescription;
    }

        // This function returns a table containing the list of parameters and their values.
    // It first checks if the list of parameters is null, and if so, returns an empty fragment.
    // Otherwise, it maps through the list of parameters and renders each parameter name and value as a table row.
    getParametersToRender = () => {
        let parameters = this.state.details.parameters;
        if (parameters === null) return <></>
        return <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="Parameter Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Parameter Name</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        parameters.map((param) => {
                            return <TableRow key={param.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    {this.getParameterDescription(param.name)}
                                </TableCell>
                                <TableCell>
                                    {param.parameter}
                                </TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    }

        // This function returns the header of the modal window.

    getModalHeader = () => {
        return <ModalHeader>
            Simulation Details
        </ModalHeader>
    }


     // This function returns the body of the modal window, which includes various details about the simulation.
    // It first checks if all the required details are present, and if not, displays a loading spinner.
    // Otherwise, it renders the simulation details, including the model name, version, update date, creator name and email,
    // model type, data percentage for auto-calibration, auto-calibration date range, and the list of parameters.
    // It also includes a button to download the observed data.
    getModalBody = () => {
        let details = this.state.details;

        if (details.modelName === "" || details.modelType === "" || !details.parameters
        || details.updateDate === "" || details.userMail === "" || details.userName === "" || details.version === 0) {
            return <ModalBody style={{ minHeight: "10rem" }}>
                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <CircularProgress size={100} thickness={2} />
                </Box>
            </ModalBody>
        }

        let timeZoneOffset = (new Date()).getTimezoneOffset() / -60;
        return <ModalBody>
            <>
                <h2 style={{ textAlign: "center" }}> 
                    { details.modelName + ' - v' + details.version }
                </h2>
                <div>
                    <span><b>Version:</b> {details.version}</span>
                </div>
                <div>
                    <span><b>Update Date:</b> {`${details.updateDate}${timeZoneOffset>0?'+'+timeZoneOffset:timeZoneOffset}`}</span>
                </div>
                <div>
                    <span><b>Creator Name: </b>{details.userName}</span>
                </div>
                <div>
                    <span><b>Creator Mail: </b>{details.userMail}</span>
                </div>
                <div>
                    <span><b>Model: </b>{details.modelType}</span>
                </div>
                <div>
                    <span><b>Data Percentage for Auto-Calibration: </b>{details.percentage}% {details.percentage === 100 ? '(Simulated)' : ''}</span>
                </div>
                <div>
                    <span><b>Auto-Calibration Date Range: </b>{details.dateRange}</span>
                </div>
                <div>
                    <span><b>Parameters: </b></span>
                    <div style={{ margin: "0.75rem 0 1.5rem 0" }}>
                        { this.getParametersToRender() }
                    </div>
                </div>
                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        disabled={!this.state.permDownload}
                        onClick={this.downloadModelData}>
                            Download Observed Data
                    </button>
                </div>
            </>
        </ModalBody>
    }
     // This function returns the footer of the modal window, which includes a button to close the window.
    getModalFooter = () => {
        return <ModalFooter>
            <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => this.setState({ showModal: false }, () => this.props.onDismiss(null))}>
                    Close
            </button>
        </ModalFooter>
    }

     // This function renders the entire modal window, including the header, body, and footer.
    // It uses the state to determine whether to show the modal and whether to enable the download button.
    render() {
        return <>
            <Modal isOpen={this.state.showModal}>
                {this.getModalHeader()}
                {this.getModalBody()}
                {this.getModalFooter()}
            </Modal>
        </>
    }
}

export default ModelDetailsModal;