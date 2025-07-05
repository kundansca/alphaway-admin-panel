// src/pages/seller/SellerEdit.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../layout/Index";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = config.api_base_url;

  const [seller, setSeller] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    status: 1,
    address: "",
    pincode: "",
    state_id: "",
    city_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequestGet("seller/detail",{ id });
      console.log(res); 
      setSeller(res.data); 
    } catch (err) {
      console.error("Failed to load seller", err);
      setError("Failed to load seller data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller((prev) => ({
      ...prev,
      [name]: name === "status" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`${apiBaseUrl}/seller/${id}`, seller);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !seller.id) {
    return (
      <Layout>
        <div className="container-fluid mt-4">
          <div className="text-center my-5">Loading seller data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container align-left mt-4">
        <h4 className="mb-4">Edit Seller</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Seller updated successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={seller.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  name="mobile"
                  className="form-control"
                  value={seller.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={seller.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  name="pincode"
                  className="form-control"
                  value={seller.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-10">
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  name="address"
                  className="form-control"
                  value={seller.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">State ID</label>
                <input
                  name="state_id"
                  className="form-control"
                  value={seller.state_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">City ID</label>
                <input
                  name="city_id"
                  className="form-control"
                  value={seller.city_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-8">
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

          <div className="mt-4">
            <button
              className="btn btn-primary me-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Seller"}
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

export default SellerEdit;
