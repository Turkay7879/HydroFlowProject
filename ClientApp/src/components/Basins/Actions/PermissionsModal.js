import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormControlLabel, Switch } from '@mui/material';
import Swal from "sweetalert2";
import '../Styles/Basins.css';
import BasinsRemote from '../flux/BasinsRemote';

class PermissionsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectedBasin: null
        }
    }

    componentDidMount() {
        this.setState({selectedBasin: this.props.selectedBasin}, () => {
            this.setState({showModal: this.props.showModal})
        });
    }

    changePermission = (key, value) => {
        let basin = this.state.selectedBasin;
        basin[key] = value;
        this.setState({selectedBasin: basin});
    }

    getModalHeader = () => {
        return <ModalHeader>
            Change Permissions
        </ModalHeader>
    }

    getModalBody = () => {
        return <ModalBody>
            <div className='permission-modal-content'>
                <FormControlLabel 
                    control={<Switch
                        checked={this.state.selectedBasin.basinPerm}
                        onChange={(e) => {
                            if (this.state.selectedBasin.basinPerm) {
                                this.changePermission('basinSpecPerm', false);
                                this.changePermission('userSpecPerm', false);
                            }
                            this.changePermission('basinPerm', !this.state.selectedBasin.basinPerm);
                        }}
                    />} 
                    label={`Basin is ${this.state.selectedBasin.basinPerm ? 'Private' : 'Public'}`}
                />
                <FormControlLabel 
                    control={<Switch
                        checked={this.state.selectedBasin.basinSpecPerm}
                        disabled={!this.state.selectedBasin.basinPerm}
                        onChange={(e) => this.changePermission('basinSpecPerm', !this.state.selectedBasin.basinSpecPerm)}
                    />} 
                    label={`BasinSpec is ${this.state.selectedBasin.basinSpecPerm ? 'Private' : 'Public'}`}
                />
                <FormControlLabel 
                    control={<Switch
                        checked={this.state.selectedBasin.userSpecPerm}
                        disabled={!this.state.selectedBasin.basinPerm}
                        onChange={(e) => this.changePermission('userSpecPerm', !this.state.selectedBasin.userSpecPerm)}
                    />} 
                    label={`UserSpec is ${this.state.selectedBasin.userSpecPerm ? 'Private' : 'Public'}`}
                />
            </div>
        </ModalBody>
    }

    getModalFooter = () => {
        return <ModalFooter>
            <button type="button" class="btn btn-primary"
                onClick={this.savePermissions}>Save Permissions</button>
            <button type="button" class="btn btn-secondary"
                onClick={this.dismissModal}>Close</button>
        </ModalFooter>
    }

    savePermissions = () => {
        let permissions = {
            BasinId: this.state.selectedBasin.id,
            BasinPermissionType: this.state.selectedBasin.basinPerm,
            BasinSpecPerm: this.state.selectedBasin.basinSpecPerm,
            UserSpecPerm: this.state.selectedBasin.userSpecPerm
        };
        BasinsRemote.savePermissions(permissions).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    Swal.fire({
                        title: "Saved Permissions",
                        text: "Successfully saved basin permissions!",
                        icon: "success"
                    }).then(() => {
                        this.props.onSave();
                        this.dismissModal();
                    });
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Couldn't save basin permissions!",
                    icon: "error"
                });
            }
        });
    }

    dismissModal = () => {
        this.setState({showModal: false}, () => this.props.onDismiss());
    }

    render() {
        return (
            <>
                {
                    this.state.showModal && <Modal isOpen={this.state.showModal}>
                        {this.getModalHeader()}
                        {this.getModalBody()}
                        {this.getModalFooter()}
                    </Modal>
                }
            </>
        );
    }
}

export default PermissionsModal;