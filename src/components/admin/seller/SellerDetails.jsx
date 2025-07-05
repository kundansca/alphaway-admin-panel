import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import defaultProfile from "../../../assets/img/logo/default.jpeg";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerDetails({ id }) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = config.api_base_url;

  useEffect(() => {
    if (id) fetchSellerDetails();
  }, [id]);

  const fetchSellerDetails = async () => {
    setLoading(true);
    try {
      const response = await apiRequestGet("seller/detail",{ id } );
      setSeller(response.data);
    } catch (error) {
      console.error("Failed to fetch seller details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!seller) return <div>Loading...</div>;

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src={seller.image || defaultProfile}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>
        <div className="mt-3">
          <p><strong>Name:</strong> {seller.name}</p>
          <p><strong>Email:</strong> {seller.email}</p>
          <p><strong>Phone:</strong> {seller.mobile}</p>
          <p><strong>Address:</strong> {seller.address}</p>
          <p><strong>Pincode:</strong> {seller.pincode}</p>
          <p><strong>Status:</strong> {seller.status === 1 ? "Active" : "Inactive"}</p>
          <p><strong>Created At:</strong> {new Date(seller.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default SellerDetails;
