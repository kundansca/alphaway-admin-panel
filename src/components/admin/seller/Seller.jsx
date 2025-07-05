import React, { useState, useEffect } from "react";
import { apiRequestGet } from "../../../utils/ApiService";
import config from "../../../config/config";
import Pagination from "../../shared/Pagination";
import Layout from "../../../layout/Index";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../shared/StatusBadge";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon, ProductIcon, OrderIcon } from "../../../config/Icons";


function Seller() {
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
      const response = await apiRequestGet("/seller/list", { page, perPageLimit: perPageLimit } );
       

      const { data, pagination } = response.data;
      setUsers(data);
      setTotalRecords(pagination.totalRecords);

    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;

    try {
      await axios.delete(`${apiBaseUrl}/seller/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers(currentPage); // Refresh list
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid col-12 mt-4">
        <div className="row">
          <div className="col-10 d-flex justify-content-between align-items-center mb-3">
            <h1>Seller List</h1>
          </div>
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
            <button type="button" className="btn btn-success" onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>
          <div className="col-2">
            <button className="btn btn-primary mb-4" onClick={() => navigate("/admin/sellers/add")}><AddIcon /></button>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">Loading sellers...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Seller ID</th>
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
                          onClick={() => navigate(`/seller/${user.id}?tab=details`)}
                        ><ViewIcon /></button>
                        <button
                          className="btn btn-sm btn-outline-primary ms-3"
                          onClick={() => navigate(`/seller/${user.id}?tab=Products`)}
                        ><ProductIcon /></button>
                        <button
                          className="btn btn-sm btn-outline-primary ms-3"
                          onClick={() => navigate(`/seller/${user.id}?tab=orders`)}
                        ><OrderIcon /></button>
                        <button
                          className="btn btn-sm btn-outline-danger ms-3"
                          onClick={() => handleDelete(user.id)}
                        ><DeleteIcon /></button>
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
          </>
        )}
      </div>
    </Layout>
  );
}

export default Seller;
