import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { SearchIcon } from "../../../config/Icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

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
    name: "",
    email: "",
    role: "",
    enabled: true,
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setViewers(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  // Search functionality
  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = originalData.filter(
      (user) =>
        (user.name || "").toLowerCase().includes(s) ||
        (user.email || "").toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status"];
    const data = selectedRows.length
      ? originalData.filter((u) => selectedRows.includes(u.id))
      : originalData;
    const rows = data.map((u) => [
      u.id,
      u.name || "",
      u.email || "",
      u.roleType?.name || "",
      u.enabled ? "Active" : "Inactive",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `users_selected_${selectedRows.length}.csv`
      : "Users.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectAll = () => {
    if (!selectAll) setSelectedRows(viewers.map((v) => v.id));
    else setSelectedRows([]);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

      users.reverse();
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
      name: user.name || "",
      email: user.email || "",
      role: user.roleType?.name || "",
      enabled: user.enabled ?? true,
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    if (!editForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Invalid email format";
    }
    if (!editForm.role) errors.role = "Role is required";

    if (editForm.password) {
      if (editForm.password.length < 6)
        errors.password = "Password must be at least 6 characters";
      if (editForm.password !== editForm.confirmPassword)
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right", // ya "bottom-end"
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
  });
  const handleSaveEdit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        enabled: editForm.enabled,
      };
      if (editForm.password) payload.password = editForm.password;
      // console.log("edit payload",payload);
      const response = await axios.put(
        `${BASEURL}/user/${selectedUser.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authData.userData.accessToken}` },
        }
      );

      const updatedUsers = originalData.map((u) =>
        u.id === selectedUser.id ? response.data : u
      );

      setOriginalData(updatedUsers);
      setFilteredData(updatedUsers);
      //   Swal.fire({

      //   title: "User updated successfully!",
      //   confirmButtonText: "OK",
      // });
      Toast.fire({
        icon: "success",
        title: "User updated successfully!",
      });
      setShowModal(false);
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: "Failed to update user. Please try again.",
      });
    }
  };

  const renderStatus = (enabled) => {
    return (
      <span className={`badge ${enabled ? "bg-success" : "bg-danger"}`}>
        {enabled ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row mb-3">
          <div className="col-6">
            <h1>Users</h1>
          </div>
          <div className="col-6 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>S.No.</th>
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
                      <tr key={user.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(user.id)}
                            onChange={() => handleRowSelect(user.id)}
                          />
                        </td>
                        <td>{(currentPage - 1) * perPage + i + 1}</td>
                        <td>{user.name || "-"}</td>
                        <td>{user.email || "-"}</td>
                        <td>{user?.roleType?.name || "-"}</td>
                        <td>{renderStatus(user.enabled)}</td>
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
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                    {formErrors.name && (
                      <small className="text-danger">{formErrors.name}</small>
                    )}
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
                    {formErrors.email && (
                      <small className="text-danger">{formErrors.email}</small>
                    )}
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
                    {formErrors.password && (
                      <small className="text-danger">
                        {formErrors.password}
                      </small>
                    )}
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
                    {formErrors.confirmPassword && (
                      <small className="text-danger">
                        {formErrors.confirmPassword}
                      </small>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={editForm.role}
                      disabled={true}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SALE">Sale</option>
                      <option value="MARKETER">Marketer</option>
                      <option value="OPERATOR">Operator</option>
                    </Form.Select>
                    {formErrors.role && (
                      <small className="text-danger">{formErrors.role}</small>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="enabled"
                      value={editForm.enabled}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          enabled: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
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
