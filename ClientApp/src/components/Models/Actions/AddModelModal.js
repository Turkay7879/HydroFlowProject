import React, { Component } from 'react';
import AddModelWizard from './AddModelWizard';

class AddModelModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    openModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    handleSubmit = () => {
        // Form submit işlemleri
        this.closeModal();
    }

    render() {
        const { showModal } = this.state;

        return (
            <div>
                <button onClick={this.openModal}>Add Model</button>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={this.closeModal}>&times;</span>
                            <AddModelWizard onSubmit={this.handleSubmit} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default AddModelModal;
