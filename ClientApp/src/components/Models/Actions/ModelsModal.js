import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

class ModelsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleSubmit(event) {
        // form submit olayı burada gerçekleşecek
        event.preventDefault();
        this.handleCloseModal();
    }

    render() {
        return (
            <div>
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
            </div>
        );
    }
}
export default ModelsModal;