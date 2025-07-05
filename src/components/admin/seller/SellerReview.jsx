// src/pages/seller/tabs/SellerReview.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import { useParams } from "react-router-dom";
import Pagination from "../../shared/Pagination";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerReview() {
  const { id: sellerId } = useParams();
  const apiBaseUrl = config.api_base_url;
  const perPageLimit = 10;

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequestGet(`${apiBaseUrl}/seller/review/list`, {
        params: { seller_id: sellerId, page, perPageLimit },
      });
      const { data } = response.data;
      setReviews(data.data || []);
      setTotalRecords(data.pagination?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching seller reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) fetchReviews(currentPage);
  }, [sellerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Reviews for Seller ID: {sellerId}</h5>
      {loading ? (
        <div>Loading reviews...</div>
      ) : (
        <>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Seller ID</th>
                  <th>Customer ID</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No reviews found.</td>
                  </tr>
                ) : (
                  reviews.map((review, index) => (
                    <tr key={review.id || index}>
                      <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                      <td>{review.seller_id}</td>
                      <td>{review.customer_id}</td>
                      <td>{review.comment}</td>
                      <td>{review.rating}</td>
                      <td>
                        <span className={`badge ${review.status === 1 ? "bg-success" : "bg-secondary"}`}>
                          {review.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
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
        </>
      )}
    </div>
  );
}

export default SellerReview;
