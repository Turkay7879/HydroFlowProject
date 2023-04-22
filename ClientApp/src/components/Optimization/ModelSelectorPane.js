import React from "react";
import Form from "react-bootstrap/Form";
import AddModelModal from "../Models/Actions/AddModelModal";
import "./Optimization.css";

class ModelSelectorPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: props.selectedModel,
            modelList: null,
            showAddModelModal: false
        };
    }
    
    componentDidMount() {
        this.setState({ modelList: this.props.userModelList });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userModelList !== this.props.userModelList) {
            this.setState({ modelList: this.props.userModelList });
        }
        if (prevProps.selectedModel !== this.props.selectedModel) {
            this.setState({ selectedModel: this.props.selectedModel });
        }
    }

    toggleAddModelModal = () => {
        this.setState({ showAddModelModal: !this.state.showAddModelModal });
    }
    
    onSaveModel = () => {
        window.location.reload();
    }

    render() {
        return (
            <>
                <div className={"model-selector-container"}>
                    {
                        !this.state.modelList ? <>
                            <div className={"selected-model"}>
                                <span>No model found to optimize in your account.</span>
                            </div>
                            <div className={"add-model-button"}>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.toggleAddModelModal}>
                                    Add Model
                                </button>
                            </div>
                        </> : <>
                            <div className={"selected-model"}>
                                <span>Selected Model: {this.state.selectedModel ? this.state.selectedModel.name : ""}</span>
                            </div>
                            <div className={"model-actions"}>
                                <div className={"model-selector"}>
                                    <Form.Select id={"model-selector-id"} onChange={this.props.onSelectModel}>
                                        <option>Select a model</option>
                                        {
                                            this.state.modelList.map((model, idx) => {
                                                return <option key={`modelNo${idx}`} value={JSON.stringify(model)}>{model.name}</option>
                                            })
                                        }
                                    </Form.Select>
                                </div>
                                <div className={"add-model-button"}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={this.toggleAddModelModal}>
                                        Add Model
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                </div>
                {
                    this.state.showAddModelModal && <AddModelModal
                        showModal={this.state.showAddModelModal}
                        onDismiss={this.toggleAddModelModal}
                        onSave={this.onSaveModel}
                    />
                }
            </>
        );
    }
}

export default ModelSelectorPane;