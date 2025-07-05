import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../shared/Pagination";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";

function CustomerWallet({ customerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [wallets, setWallets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchWalletData = async (page) => {
    setLoading(true);
    try {
      const data = await apiRequestGet("/attribute/list");
      setCustomer(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchWalletData(currentPage);
    }
  }, [customerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Wallet Entries for Customer ID: {customerId}</h5>

      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wallets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No wallet entries found.
                </td>
              </tr>
            ) : (
              wallets.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>{entry.id}</td>
                  <td>₹{entry.amount}</td>
                  <td>{entry.description}</td>
                  <td>{entry.status}</td>
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

export default CustomerWallet;
