import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../shared/Pagination";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";

function CustomerTransactions({ customerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (page) => {
    setLoading(true);
    try {
     const data = await apiRequestGet("/attribute/list");
       setCustomer(data.data); 
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTransactions(currentPage);
    }
  }, [customerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Transactions for Customer ID: {customerId}</h5>

      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover align-middle">
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
              transactions.map((txn, index) => (
                <tr key={txn.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>₹{txn.amount}</td>
                  <td>{txn.description}</td>
                  <td>{txn.paymentStatus}</td>
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

export default CustomerTransactions;
