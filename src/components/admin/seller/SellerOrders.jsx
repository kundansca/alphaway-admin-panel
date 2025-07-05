// src/pages/seller/SellerOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerOrders({ sellerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchOrders = async (page) => {
    try {
      const response = await apiRequestGet(`${apiBaseUrl}/seller/orders`, {
        params: { sellerId, page, perPageLimit },
      });
      const { data } = response.data;
      setOrders(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchOrders(currentPage);
    }
  }, [sellerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Orders for Seller ID: {sellerId}</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>{order.id}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{order.itemCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={totalRecords}
        itemsPerPage={perPageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default SellerOrders;
