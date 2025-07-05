import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";

import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import Layout from "../../../layout/Index";
import { apiRequestGet } from "../../../utils/ApiService";
import StatusBadge from "../../shared/StatusBadge";
import ProductModal from "./productModal";

const WEBSITE_URL = "https://ilbmart.com/";
function Product() {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    setLoading(true);

    try {
      const response = await apiRequestGet(`/product/list`, {
        page,
        perPageLimit: perPageLimit,
      });
        console.log(response);
        
      const { data, pagination } = response.data;
      setProducts(data);
      setTotalRecords(pagination.totalRecords);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);
 const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchProducts(currentPage);
  };
  return (
    <Layout>
      <div className="container-fluid col-12">
        <div className="d-flex justify-content-between row mt-3 mb-3">
          <div className="col-10">
            <h1 className="mt-5">Product List</h1>
          </div>
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name, Email, Mobile"
            />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-success"><SearchIcon /></button>
          </div>
         
          <div className="col-2">
            <button onClick={handleOpenAddModal} className="btn btn-primary mb-4"><AddIcon /></button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Brand</th>
                <th scope="col">Brrand Name</th>  
                <th scope="col">Category</th> 
                <th scope="col">Prod. Code</th>
                <th scope="col">Fssi Code</th>
                 <th scope="col">Product Name</th>
                 <th scope="col">Slug</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id}>
                    <th scope="row">
                      {(currentPage - 1) * perPageLimit + index + 1}
                    </th>
                    <td>{product.brand_id}</td>
                    <td><a href={`${WEBSITE_URL}/${product.slug}`} target="_BLANK">{product.name}</a></td> 
                    <td>{product.cat_id}</td> 
                    <td>{product.product_code}</td>
                    <td>{product.fssi_code}</td>
                    <td>{product.name}</td> 
                    <td>{product.slug }</td> 
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm"><ViewIcon /></button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenEditModal(product)}><EditIcon /></button>
                      <button className="btn btn-outline-danger btn-sm"><DeleteIcon /></button>
                      
                    </td>
                  </tr>
                ))
              ) : !loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No products available.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={totalRecords}
          itemsPerPage={perPageLimit}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {showModal && (
          <ProductModal
            show={showModal}
            handleClose={handleModalClose}
            editingProduct={editingProduct}
          />
        )}
      </div>
    </Layout>
  );
}

export default Product;
