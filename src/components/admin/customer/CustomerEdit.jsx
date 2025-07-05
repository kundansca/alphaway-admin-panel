import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../layout/Index";
import { apiRequestGet } from "../../../utils/ApiService";

function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = config.api_base_url;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    status: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use axios.get with params for GET request
      const res = await apiRequestGet( "customer/detail", { id } ); 
        setCustomer(res.data); 
    } catch (err) {
      console.error("Failed to load customer", err);
      setError("Failed to load customer data");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
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
      await axios.put(`${apiBaseUrl}/customer/${id}`, customer, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.message || "Update failed");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !customer.id) {
    return (
      <Layout>
        <div className="container-fluid mt-4">
          <div className="text-center my-5">Loading customer data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container align-left mt-4">
        <h4 className="mb-4">Edit Customer</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Customer updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Row 1: Name and Mobile */}
            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={customer.name}
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
                  value={customer.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Email and Pincode */}
            <div className="col-md-5">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={customer.email}
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
                  value={customer.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3: Address and State ID */}
            <div className="col-md-10">
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  name="address"
                  className="form-control"
                  value={customer.address}
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
                  value={customer.state_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">city ID</label>
                <input
                  name="city_id"
                  className="form-control"
                  value={customer.city_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 4: Status full width */}
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={customer.status}
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
              {loading ? "Updating..." : "Update Customer"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/customers")}
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

export default CustomerEdit;
