import React, { useEffect, useState } from "react";
import { apiRequestGet } from "../../../utils/ApiService";
// import config from "../../../config/config";
import defaultProfile from "../../../assets/img/logo/default.jpeg";
function CustomerDetails({ id }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const data = await apiRequestGet("/customer/detail", { id });
      console.log("Customer response:", data);
      setCustomer(data.data);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !customer) return <div>Loading...</div>;


  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>

        {/* Profile image on top center */}
        <div className="text-center mb-4">
          <img
            src={customer.image || defaultProfile}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>

        {/* Customer details below */}
        <div className="mt-3">
          <p><strong>Full Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.mobile}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Pincode:</strong> {customer.pincode}</p>
          <p><strong>Status:</strong> {customer.status === 1 ? "Active" : "Inactive"}</p>
          <p><strong>Created At:</strong> {new Date(customer.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
export default CustomerDetails;
