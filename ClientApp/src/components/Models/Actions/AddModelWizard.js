import React, { Component } from 'react';

class AddModelWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            name: '',
            title: '',
            createDate: '',
            modelFile: '',
            modelPermissionId: '',
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleNextStep = () => {
        this.setState({ step: this.state.step + 1 });
    };

    handlePreviousStep = () => {
        this.setState({ step: this.state.step - 1 });
    };

    handleSubmit = () => {
        // Yeni modeli kaydetmek için gerekli kodlar
    };

    render() {
        const { step, name, title, createDate, modelFile, modelPermissionId } = this.state;

        return (
            <div>
                {step === 1 && (
                    <div>
                        <h3>Step 1: Enter name and title</h3>
                        <label>
                            Name:
                            <br />
                            <input type="text" name="name" value={name} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Title:
                            <br />
                            <input type="text" name="title" value={title} onChange={this.handleChange} />
                        </label>
                        <br />
                        <button onClick={this.handleNextStep}>Next</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h3>Step 2: Enter create date and model file</h3>
                        <label>
                            Create date:
                            <br />
                            <input type="text" name="createDate" value={createDate} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Model file:
                            <br />
                            <input type="text" name="modelFile" value={modelFile} onChange={this.handleChange} />
                        </label>
                        <br />
                        <button onClick={this.handlePreviousStep}>Previous</button>
                        <button onClick={this.handleNextStep}>Next</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3>Step 3: Enter model permission ID</h3>
                        <label>
                            Model permission ID:
                            <br />
                            <input type="text" name="modelPermissionId" value={modelPermissionId} onChange={this.handleChange} />
                        </label>
                        <br />
                        <button onClick={this.handlePreviousStep}>Previous</button>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}
export default AddModelWizard;
