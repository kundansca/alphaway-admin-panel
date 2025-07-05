import React, { useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/Index";
import ToastMsg from '../../shared/ToastMsg';

function SellerAdd() {
  const navigate = useNavigate();
  const apiBaseUrl = config.api_base_url;

  const [seller, setSeller] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    countryid: "",
    stateid: "",
    cityid: "",
    pincode: "",
    address: "",
    image: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});


  const handleChange = (e) => {
  const { name, value, files } = e.target;
  setSeller((prev) => ({
    ...prev,
    [name]: name === "image" ? files[0] : name === "status" ? parseInt(value) : value,
  }));
};
  const validate = () => {
    const errors = {};
    if (!seller.name.trim()) errors.name = "Name is required";
    if (!seller.email.trim()) errors.email = "Email is required";
    if (!seller.mobile.trim()) errors.mobile = "Mobile is required";
    if (!seller.password.trim()) errors.password = "Password is required";
    return errors;
  };

 const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('status', status);
            if (image) formData.append('image', image);
            if (editingBrand?.id) formData.append('id', editingBrand.id); // if updating

            const endpoint = editingBrand ? '/brasellernd/update' : '/seller/addnew';
            const response = await apiRequestPost(endpoint, formData, true);

            if (response.status) {
                ToastMsg(editingBrand ? 'Seller updated successfully' : 'Seller created successfully', 'success');
                onHide();
            } else {
                ToastMsg(response.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Brand submission error:', error);
            ToastMsg('Error submitting form', 'error');
        } finally {
            setLoading(false);
        }
    };

  return (
    <Layout>
      <div className="container align-left mt-4">
        <h4 className="mb-4">Add Seller</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">Seller added successfully!</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Name */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={seller.name}
                  onChange={handleChange}
                />
                {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}
              </div>
            </div>

            {/* Mobile */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  name="mobile"
                  className="form-control"
                  value={seller.mobile}
                  onChange={handleChange}
                />
                {validationErrors.mobile && <div className="text-danger">{validationErrors.mobile}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={seller.email}
                  onChange={handleChange}
                />
                {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}
              </div>
            </div>

            {/* Username */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={seller.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={seller.password}
                  onChange={handleChange}
                />
                {validationErrors.password && <div className="text-danger">{validationErrors.password}</div>}
              </div>
            </div>

            {/* Country ID */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Country ID</label>
                <input
                  name="countryid"
                  className="form-control"
                  value={seller.countryid}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* State ID */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">State ID</label>
                <input
                  name="stateid"
                  className="form-control"
                  value={seller.stateid}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* City ID */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">City ID</label>
                <input
                  name="cityid"
                  className="form-control"
                  value={seller.cityid}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  name="pincode"
                  className="form-control"
                  value={seller.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  name="address"
                  className="form-control"
                  value={seller.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
  type="file"
  name="image"
  className="form-control"
  onChange={handleChange}
/>
              </div>
            </div>

            {/* Status */}
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={seller.status}
                  onChange={handleChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              className="btn btn-primary me-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Seller"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/sellers")}
              disabled={loading}
            >
              Back to List
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default SellerAdd;
