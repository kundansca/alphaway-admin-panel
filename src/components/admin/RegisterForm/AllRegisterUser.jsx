import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { SearchIcon } from "../../../config/Icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

function AllRegisterUser() {
  const perPage = 10;
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;
  const authData = useSelector((state) => state.auth);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "Inactive",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setViewers(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  // Search functionality
  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = originalData.filter((user) =>
      (user.firstName || "").toLowerCase().includes(s) ||
      (user.lastName || "").toLowerCase().includes(s) ||
      (user.email || "").toLowerCase().includes(s) ||
      (user.role || "").toLowerCase().includes(s) ||
      (user.status || "").toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Role", "Status"];
    const data = selectedRows.length
      ? originalData.filter((u, i) => selectedRows.includes(u.id || i + 1))
      : originalData;
    const rows = data.map((u, i) => [
      u.id || i + 1,
      u.firstName || "",
      u.lastName || "",
      u.email || "",
      u.role || "",
      u.status || "Inactive"
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `users_selected_${selectedRows.length}.csv`
      : "users_list.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectAll = () => {
    if (!selectAll) setSelectedRows(viewers.map((v, i) => v.id || i + 1));
    else setSelectedRows([]);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = id => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASEURL}/users`, {
        headers: { Authorization: `Bearer ${authData.userData.accessToken}` },
      });
      const users = response.data.content || [];
      setFilteredData(users);
      setOriginalData(users);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
      status: user.status || "Inactive",
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;
      delete payload.confirmPassword;

      const response = await axios.put(
        `${BASEURL}/users/${selectedUser.id}`,
        payload,
        { headers: { Authorization: `Bearer ${authData.userData.accessToken}` } }
      );

      const updatedUsers = originalData.map(u =>
        u.id === selectedUser.id ? response.data : u
      );
      setOriginalData(updatedUsers);
      setFilteredData(updatedUsers);
      setShowModal(false);
    } catch (err) {
      alert("Failed to update user. Try again.");
    }
  };

  const renderStatus = (status) => {
    const isActive = status?.toLowerCase() === "active";
    return (
      <span className={`badge ${isActive ? "bg-success" : "bg-danger"}`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row mb-3">
          <div className="col-6">
            <h1>All Registered Users</h1>
          </div>
          <div className="col-6 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email, role, status"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-success" onClick={handleSearch}>
              <SearchIcon />
            </button>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              {selectedRows.length
                ? `Export CSV (${selectedRows.length})`
                : "Export CSV"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewers.length > 0 ? (
                    viewers.map((user, i) => (
                      <tr key={user.id || i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(user.id || i + 1)}
                            onChange={() => handleRowSelect(user.id || i + 1)}
                          />
                        </td>
                        <td>{(currentPage - 1) * perPage + i + 1}</td>
                        <td>{`${user.firstName || ""} ${user.lastName || ""}`}</td>
                        <td>{user.email || "-"}</td>
                        <td>{user.role || "-"}</td>
                        <td>{renderStatus(user.status)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={filteredData.length}
              itemsPerPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="User">User</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={editForm.password}
                      onChange={handleEditChange}
                      placeholder="Leave blank if no change"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={editForm.confirmPassword}
                      onChange={handleEditChange}
                      placeholder="Leave blank if no change"
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}

export default AllRegisterUser;
