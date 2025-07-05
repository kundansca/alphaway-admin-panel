// src/pages/seller/SellerTransactions.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerTransactions({ sellerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchTransactions = async (page) => {
    try {
      const response = await apiRequestGet(`${apiBaseUrl}/seller/transactions`, {
        params: { sellerId, page, perPageLimit },
      });
      const { data } = response.data;
      setTransactions(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchTransactions(currentPage);
    }
  }, [sellerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Transactions for Seller ID: {sellerId}</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr key={tx.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>₹{tx.amount}</td>
                  <td>{tx.description}</td>
                  <td>{tx.paymentStatus}</td>
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

export default SellerTransactions;
