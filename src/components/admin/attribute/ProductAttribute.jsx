import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";
import Pagination from "../../shared/Pagination";
import Layout from "../../../layout/Index";
import ProductAttributeModal from "./ProductAttributeModal";
import StatusBadge from "../../shared/StatusBadge";

function ProductAttribute() {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequestGet(apiBaseUrl + "/attribute/list", {
        params: { page, perPageLimit },
      });
      const { data } = response.data;
      setData(data.data);
      setTotalRecords(data.pagination.totalRecords);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching Data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalOpen = (attribute = null) => {
    setSelectedAttribute(attribute);
    setModalShow(true);
  };

  const handleSaveAttribute = async (attribute) => {
    try {
      if (attribute.id) {
        await axios.put(`${apiBaseUrl}/attribute/update/${attribute.id}`, attribute);
      } else {
        await axios.post(`${apiBaseUrl}/attribute/create`, attribute);
      }
      fetchData(currentPage);
    } catch (error) {
      console.error("Error saving attribute:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attribute?")) {
      try {
        await axios.delete(`${apiBaseUrl}/attribute/delete/${id}`);
        fetchData(currentPage);
      } catch (error) {
        console.error("Error deleting attribute:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="container-fluid col-12">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Product Attributes List</h1>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Search..." />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-success">Search</button>
          </div>
          <div className="col-2 d-flex justify-content-end">
            <button className="btn btn-primary mb-4" onClick={() => handleModalOpen()}>
              + Add Product
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((attr, index) => (
                <tr key={attr.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{attr.name}</td>
                  <td><StatusBadge status={attr.status} /></td>
                  <td>
                    <button
                      className="btn btn-sm ms-2 btn-outline-primary"
                      onClick={() => handleModalOpen(attr)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm ms-2 btn-outline-danger"
                      onClick={() => handleDelete(attr.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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

      <ProductAttributeModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        onSave={handleSaveAttribute}
        initialData={selectedAttribute}
      />
    </Layout>
  );
}

export default ProductAttribute;
