import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import { apiRequestGet } from "../../../utils/ApiService";

function SellerProducts({ sellerId }) {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchProducts = async (page) => {
    try {
      const response = await apiRequestGet(`${apiBaseUrl}/seller/products`, {
        params: { sellerId, page, perPageLimit },
      });
      const { data } = response.data;
      setProducts(data.data);
      setTotalRecords(data.pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts(currentPage);
    }
  }, [sellerId, currentPage]);

  return (
    <div className="container-fluid mt-3">
      <h5>Products for Seller ID: {sellerId}</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Base Price</th>
              <th>Sale Price</th>
              <th>Discount (%)</th>
              <th>Quantity</th>
              <th>Units</th>
              <th>Discount Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No products found.</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1 + (currentPage - 1) * perPageLimit}</td>
                  <td>{product.id}</td>
                  <td>₹{product.basePrice}</td>
                  <td>₹{product.salePrice}</td>
                  <td>{product.discount}</td>
                  <td>{product.quantity}</td>
                  <td>{product.units}</td>
                  <td>{product.discountType}</td>
                  <td>{product.status === 1 ? "Active" : "Inactive"}</td>
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

export default SellerProducts;
