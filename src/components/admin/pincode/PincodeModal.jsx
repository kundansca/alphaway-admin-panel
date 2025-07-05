import React, { useState, useEffect } from "react";
import config from "../../../config/config";
import ToastMsg from "../../shared/ToastMsg";
import { apiRequestPost } from "../../../utils/ApiService";

function PincodeModal({ show, handleClose, editingPincode }) {
    const [id, setId] = useState("");
    const [areaName, setAreaName] = useState("");
    const [pincode, setPincode] = useState("");
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingPincode) {
            setId(editingPincode.id || "");
            setAreaName(editingPincode.area_name || "");
            setPincode(editingPincode.pincode || "");
            setStatus(editingPincode.status || "1");
        } else {
            setAreaName("");
            setPincode("");
            setStatus("1");
        }
        setErrors({});
    }, [editingPincode]);

    const validateForm = () => {
        const newErrors = {};
        if (!areaName.trim()) newErrors.areaName = "Area Name is required";
        if (!pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{4,10}$/.test(pincode)) newErrors.pincode = "Enter valid pincode";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const formData = {
            area_name: areaName,
            pincode,
            status,
        };
        if(editingPincode){
            formData.id = editingPincode.id;
        }


        try {
            const endpoint = editingPincode ? `/pincode/update` : "/pincode/addnew";

            const response = await apiRequestPost(endpoint, formData);

            if (response.status) {
                ToastMsg(
                    editingPincode ? "Updated successfully" : "Created successfully",
                    "success"
                );
                
            } else {
                ToastMsg(response.error || "Something went wrong", "error");
            }
            handleClose();
        } catch (error) {
            console.error("Error saving pincode:", error);
            ToastMsg(error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">{editingPincode ? "Edit" : "Add"} Pincode</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Area Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.areaName ? "is-invalid" : ""}`}
                                    value={areaName}
                                    onChange={(e) => setAreaName(e.target.value)}
                                />
                                {errors.areaName && <div className="invalid-feedback">{errors.areaName}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Pincode</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PincodeModal;
