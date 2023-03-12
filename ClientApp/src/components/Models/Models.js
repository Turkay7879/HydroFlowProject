import React from "react";
import ModelsRemote from "./flux/ModelsRemote";
import "./Models.css";

class Models extends React.Component {
    tableColumns = ["Name", "Title", "CreateDate", "Model File", "Model Permission ID"];

    constructor(props) {
        super(props);
        this.state = {
            loadingModels: true,
            models: null
        };
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
                {this.state.loadingModels ? <p className="fs-1">Loading Models...</p> :
                    !this.state.models ? <p className="fs-1">No Model Found</p> :
                        this.getBody()
                }
            </div>
        );
    }
}

export default Models;
