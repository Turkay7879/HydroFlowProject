import React from 'react';
import { FormGroup, Label, Input } from "reactstrap";
import { FormControlLabel, Checkbox } from '@mui/material';

class GivePermissionToUserForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <FormGroup>
                    <Label for="userMail">Mail of the User to Give Permissions To:</Label>
                    <Input
                        id='userMail'
                        name='PermittedUserMail'
                        type='email'
                        defaultValue={this.props.permissions.PermittedUserMail}
                        onChange={(e) => this.props.onChangePermission('PermittedUserMail', e.target.value)}
                    />
                </FormGroup>
                <FormControlLabel 
                    control={<Checkbox
                        checked={this.props.permissions.PermData}
                        onChange={() => this.props.onChangePermission('PermData', !this.props.permissions.PermData)}
                    />}
                    label={`Give Detailed Data View Permission`}
                />
                <FormControlLabel 
                    control={<Checkbox
                        checked={this.props.permissions.PermDownload}
                        onChange={() => this.props.onChangePermission('PermDownload', !this.props.permissions.PermDownload)}
                    />}
                    label={`Give Dataset Download Permission`}
                />
                <FormControlLabel 
                    control={<Checkbox
                        checked={this.props.permissions.PermSimulation}
                        onChange={() => this.props.onChangePermission('PermSimulation', !this.props.permissions.PermSimulation)}
                    />}
                    label={`Give Simulation and Auto-Calibration Permission`}
                />
            </>
        );
    }
}

export default GivePermissionToUserForm;