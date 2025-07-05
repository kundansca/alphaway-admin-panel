import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/config";
import { apiRequestGet } from "../../../utils/ApiService";
import Pagination from "../../shared/Pagination";
import Layout from "../../../layout/Index";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../shared/StatusBadge";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";

function Customer() {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequestGet("/customer/list", { page, perPageLimit: perPageLimit });
      console.log("Response:", response);
      const { data, pagination } = response.data;
      setUsers(data);
      setTotalItems(pagination.totalRecords);

    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1); // Reset to first page when searching
  };

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <h1>Customer List</h1>
        <div className="row mb-3">
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, mobile"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-4">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSearch}
            ><SearchIcon /></button>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">Loading customers...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>CusID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country Id</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{(currentPage - 1) * perPageLimit + index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.country_id}</td>
                      <td>{user.mobile}</td>
                      <td><StatusBadge status={user.status} /></td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => navigate(`/customer/${user.id}?tab=details`)}
                        >
                          <ViewIcon />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => navigate(`/customer/${user.id}?tab=edit`)}
                        >
                          <EditIcon />
                        </button>
                        <button className="btn btn-sm btn-outline-danger ms-2">
                          <DeleteIcon />
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
              totalRecords={totalRecords}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>

    </Layout>
  );
}

export default Customer;