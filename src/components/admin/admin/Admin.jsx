import React, { useState, useEffect } from "react";
import Pagination from "../../shared/Pagination";
import Layout from "../../../layout/Index";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";
import StatusBadge from "../../shared/StatusBadge";
import AdminModal from "./AdminModal";
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";

const DEFAULT_IMAGE = config.DEFAULT_IMAGE;
const IMAGE_BASE_URL = config.IMAGE_BASE_URL;
function Admin() {
  const perPage = 10;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const fetchUsers = async (page) => {
    setLoading(true);
    console.log("Fetching users for page:");
    try {
      const response = await apiRequestGet("/emp/list", { page, perPageLimit: perPage });
      // console.log("Response:", response);
      const { data, pagination } = response.data;
      setUsers(data);
      setTotalItems(pagination.totalRecords);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleOpenAddModal = () => {
    setEditingAdmin(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingAdmin(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between row mt-3 mb-3">
          <div className="col-10">
            <h1 className="mt-4">Admin List</h1>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-success"><SearchIcon /></button>
          </div>
          <div className="col-2">
            <button className="btn btn-primary" onClick={handleOpenAddModal}><AddIcon /></button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td><a href={`${IMAGE_BASE_URL+user.image}`} target="_BLANK"><img
  src={`${IMAGE_BASE_URL+user.image}`}
  alt={user.name}
  className="img-thumb w-25"
  onError={(e) => {
    e.target.onerror = null; // Prevents infinite loop
    e.target.src = DEFAULT_IMAGE; // Fallback image
  }}
/></a>
</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.mobile}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenEditModal(user)}
                        ><EditIcon /></button>
                        <button className="btn btn-sm btn-outline-danger" type="button"><DeleteIcon /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          totalItems={totalItems}
          itemsPerPage={perPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <AdminModal
          show={showModal}
          handleClose={handleModalClose}
          user={editingAdmin}
        />
      </div>
    </Layout>
  );
}

export default Admin;
