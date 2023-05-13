import React from "react";
import Form from "react-bootstrap/Form";
import AddModelModal from "../Models/Actions/AddModelModal";
import GivePermissionToUserModal from "./SimulationPermissions/GivePermissionToUserModal";
import "./Optimization.css";

class ModelSelectorPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: props.selectedModel,
            modelList: null,
            showAddModelModal: false,
            showGivePermissionModal: false
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

    toggleAddModelModal = (result) => {
        this.setState({ showAddModelModal: !this.state.showAddModelModal });
    }

    togglePermissionToUserModal = () => {
        this.setState({ showGivePermissionModal: !this.state.showGivePermissionModal });
    }
    
    onSaveModel = () => {
        window.location.reload();
    }

    render() {
        return (
            <>
                <div className={"model-selector-container"}>
                    {
                        (!this.state.modelList || this.state.modelList.length === 0) ? <>
                            <div className={"selected-model"}>
                                <span>No model found to optimize in your account.</span>
                            </div>
                            <div className={"add-model-button"}>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.toggleAddModelModal}>
                                    Create Simulation
                                </button>
                            </div>
                        </> : <>
                            <div className={"selected-model"}>
                                <span>Selected Simulation: {this.state.selectedModel ? this.state.selectedModel.name : ""}</span>
                            </div>
                            <div className={"model-actions"}>
                                {
                                    this.state.selectedModel && this.state.selectedModel.modelPermissionId === 1 && 
                                    <div className={"give-permission-button"}>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={this.togglePermissionToUserModal}>
                                            Give Permission to a User
                                        </button>
                                    </div>
                                }
                                <div className={"model-selector"}>
                                    <Form.Select id={"model-selector-id"} onChange={this.props.onSelectModel}>
                                        <option>Select a simulation</option>
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
                                        Create Simulation
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
                {
                    this.state.showGivePermissionModal && <GivePermissionToUserModal
                        showModal={this.state.showGivePermissionModal}
                        onDismiss={this.togglePermissionToUserModal}
                        selectedModel={this.state.selectedModel}
                    />
                }
            </>
        );
    }
}

export default ModelSelectorPane;