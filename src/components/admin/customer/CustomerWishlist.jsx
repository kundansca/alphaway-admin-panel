import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../shared/Pagination";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";

function CustomerWishlist({ customerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchWishlistData = async (page) => {
    setLoading(true);
    try {
      // Placeholder until real API is available
      const response = await apiRequestGet(`${apiBaseUrl}/customer/wishlist`, {
        params: { customerId, page, perPageLimit }
      });

      const { data } = response.data;
      setWishlist(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchWishlistData(currentPage);
    }
  }, [customerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Wishlist for Customer ID: {customerId}</h5>

      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No wishlist items found.
                </td>
              </tr>
            ) : (
              wishlist.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>{item.productId}</td>
                  <td>{item.status === 1 ? "Active" : "Inactive"}</td>
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

export default CustomerWishlist;
