import React, { useState } from "react";
import Layout from "../../../layout/Index";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const authData = useSelector((state) => state.auth);
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // field change hote hi uska error hatao
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    // ✅ Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // ✅ Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // ✅ Role Validation
    if (!formData.role) {
      newErrors.role = "Please select a role.";
    }

    // ✅ Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // ✅ Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      let payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      await axios.post(`${BASEURL}/add-user`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      });

      Toast.fire({
        icon: "success",
        title: "User added successfully!",
      });

      // reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 409)
      ) {
        Toast.fire({
          icon: "error",
          title: error?.response?.data?.errors[0] || "Email already exists!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4 rounded-4 border-0">
              <h3 className="text-center mb-4 fw-bold">Add User</h3>

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select shadow-sm"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SALE">Sale</option>
                    <option value="MARKETER">Marketer</option>
                    <option value="OPERATOR">Operator</option>
                  </select>
                  {errors.role && (
                    <small className="text-danger">{errors.role}</small>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-sm"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {formData.password !== "" && (
                    <span
                      className="position-absolute end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer", top: "50px" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </span>
                  )}

                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control shadow-sm"
                    placeholder="Re-enter password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm text-light me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Saving user…
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterForm;
