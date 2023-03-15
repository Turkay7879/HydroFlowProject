import ModelsRemote from "../flux/ModelsRemote";
import "../Models.css";
import React, { useState } from "react";

function AddModel(props) {
    const [formData, setFormData] = useState({
        Name: "",
        Title: "",
        ModelFile: "",
        ModelPermissionId: ""
    });

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSave(formData);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h4>Add Model</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Name">Name:</label>
                        <input
                            type="text"
                            id="Name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Title">Title:</label>
                        <input
                            type="text"
                            id="Title"
                            name="Title"
                            value={formData.Title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ModelFile">Model File:</label>
                        <input
                            type="file"
                            id="ModelFile"
                            name="ModelFile"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ModelPermissionId">Model Permission ID:</label>
                        <input
                            type="text"
                            id="ModelPermissionId"
                            name="ModelPermissionId"
                            value={formData.ModelPermissionId}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success mr-2">
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={props.onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddModel;
