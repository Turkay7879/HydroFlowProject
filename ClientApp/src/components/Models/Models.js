import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ModelsRemote from "./flux/ModelsRemote";
import "./Models.css";

class Models extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingModels: true,
            models: [],
            showModal: false
        };

        this.tableColumns = ['Name', 'Title', 'Create Date', 'Model File', 'Model Permission ID'];
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = async () => {
        ModelsRemote.getAllModels()
            .then((response) => {
                response.json().then(data => {
                    this.setState({ loadingModels: false, models: data });
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loadingModels: false });
            });
    }

    handleOpenModal = () => {
        this.setState({ showModal: true });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleSubmit = (event) => {
        // form submit olayı burada gerçekleşecek
        event.preventDefault();
        this.handleCloseModal();
    };

    getBody() {
        return (
            <div className="table-responsive">
                <table className="table table-hover" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            {this.tableColumns.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.models.map(model =>
                            <tr key={model.Id}>
                                <td>{model.Name}</td>
                                <td>{model.Title}</td>
                                <td>{model.CreateDate}</td>
                                <td>{model.ModelFile}</td>
                                <td>{model.ModelPermissionId}</td>
                                <td>
                                    <Button variant="primary" onClick={() => this.handleEditModel(model)}>Edit</Button>
                                    <Button variant="danger" onClick={() => this.handleDeleteModel(model)}>Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="models-container">
                <Button onClick={this.handleOpenModal}>Add Model</Button>
                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Model</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" />
                            </Form.Group>

                            <Form.Group controlId="formTitle">
                                <Form.Label>Title:</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" />
                            </Form.Group>

                            <Form.Group controlId="formCreateDate">
                                <Form.Label>Create Date:</Form.Label>
                                <Form.Control type="text" placeholder="Enter create date" />
                            </Form.Group>

                            <Form.Group controlId="formModelFile">
                                <Form.Label>Model File:</Form.Label>
                                <Form.Control type="text" placeholder="Enter model file" />
                            </Form.Group>

                            <Form.Group controlId="formModelPermissionId">
                                <Form.Label>Model Permission ID:</Form.Label>
                                <Form.Control type="text" placeholder="Enter model permission ID" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {this.state.loadingModels ? <p className="fs-1">Loading Models...</p> :
                    !this.state.models ? <p className="fs-1">No Model Found</p> :
                        <div className="table-responsive">
                            <table className="table table-hover" aria-labelledby="tableLabel">
                                <thead>
                                    <tr>
                                        {this.tableColumns.map(col => <th key={col}>{col}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.models.map(model => (
                                        <tr key={model.Id}>
                                            <td>{model.Name}</td>
                                            <td>{model.Title}</td>
                                            <td>{model.CreateDate}</td>
                                            <td>{model.ModelFile}</td>
                                            <td>{model.ModelPermissionId}</td>
                                            <td>
                                                <Button variant="primary" onClick={() => this.handleEditModel(model)}>Edit</Button>
                                                <Button variant="danger" onClick={() => this.handleDeleteModel(model)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                }
            </div>
        );
    }
}
export default Models; 