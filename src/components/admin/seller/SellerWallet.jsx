// src/pages/seller/SellerWallet.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerWallet({ sellerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [wallets, setWallets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchWallets = async (page) => {
    try {
      const response = await apiRequestGet(`${apiBaseUrl}/seller/wallets`, {
        params: { sellerId, page, perPageLimit },
      });
      const { data } = response.data;
      setWallets(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchWallets(currentPage);
    }
  }, [sellerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Wallet for Seller ID: {sellerId}</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
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
                <td colSpan="5" className="text-center">No wallet entries found.</td>
              </tr>
            ) : (
              wallets.map((wallet, index) => (
                <tr key={wallet.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>{wallet.id}</td>
                  <td>₹{wallet.amount}</td>
                  <td>{wallet.description}</td>
                  <td>{wallet.status}</td>
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

export default SellerWallet;
