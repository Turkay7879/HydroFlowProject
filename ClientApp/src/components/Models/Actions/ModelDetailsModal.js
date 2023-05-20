import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Buffer } from 'buffer';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import ModelsRemote from '../flux/ModelsRemote';

class ModelDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            model: props.model,
            details: {
                modelName: "",
                updateDate: "",
                version: 0,
                modelType: "",
                parameters: null,
                userName: "",
                userMail: ""
            },
            permDownload: props.permDownload
        }
    }

    componentDidMount() {
        let session = window.localStorage.getItem("hydroFlowSession");
        let userId = 0;
        if (session) {
            let sessionObject = JSON.parse(session);
            userId = sessionObject.sessionUserId;
        }

        ModelsRemote.getDetailsOfModel({ modelId: this.state.model.id, userId: userId }).then(response => {
            if (response.ok) {
                response.json().then(detailsData => {
                    let details = this.state.details;

                    details.modelName = detailsData.latestDetails.modelName;
                    var date = new Date(detailsData.latestDetails.updateDate);
                    date.setUTCHours(date.getUTCHours() + 3);
                    details.updateDate = date.toUTCString();
                    details.version = detailsData.latestDetails.version;
                    details.modelType = detailsData.modelType;
                    details.parameters = detailsData.parameters;
                    details.userName = detailsData.user.name;
                    details.userMail = detailsData.user.email;

                    this.setState({ details: details });
                });
            } else if (response.status === 412) {
                response.json().then(errMsg => {
                    Swal.fire({
                        title: "Error",
                        text: errMsg,
                        icon: "error"
                    }).then(() => this.setState({ showModal: false }, () => this.props.onDismiss(null)));
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "An error occured while retrieving simulation details.",
                    icon: "error"
                }).then(() => this.setState({ showModal: false }, () => this.props.onDismiss(null)));
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.permDownload !== this.props.permDownload){
            this.setState({permDownload: this.props.permDownload});
        }
    }

    downloadModelData = () => {
        ModelsRemote.downloadModelData(this.state.model.id).then(response => response.json().then(model => {
            let data = model.modelFile;
            const bytes = Buffer.from(data, 'base64')
            const blob = new Blob([bytes])
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "observed-data.xlsx";
            link.click();
            link.remove();
        }))
    }

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

    getModalHeader = () => {
        return <ModalHeader>
            Simulation Details
        </ModalHeader>
    }

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
                    <span><b>Data Percentage for Optimization: </b>{this.state.model.training_Percentage}%</span>
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