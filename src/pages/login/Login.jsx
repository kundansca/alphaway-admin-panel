import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { apiRequestPostWithoutToken } from '../utils/ApiService';
import "./Login.css";
import logo from "../../assets/img/logo/alphaway_logo.png";
// import circlelogo from '../../assets/img/logo/circleLogo.png';
import circlelogo from "../../assets/img/logo/circleLogo.png";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../features/auth/authThunks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const { username, password } = formData;

    // Client-side validation
    const errors = {};
    if (!username.trim()) {
      errors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = "Invalid email address";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length) return setFieldErrors(errors);

    try {
      setLoading(true);
      await dispatch(loginAdmin({ email: username, password })).unwrap();

      navigate("/admin/enquiry");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-body">
      <div className="gamboge-container">
        <div className="white-container">
          <div className="login-container">
            <div className="login-container-wrapper">
              <div className="login-logo">
                <img src={logo} alt="Logo" draggable="false" />
              </div>
              <div className="login-form">
                <div className="login-logo-mobile">
                  <img src={circlelogo} alt="Logo" draggable="false" />
                </div>
                <h5 className="login-title">Admin Login</h5>
                <div className="login-form-input">
                  <form
                    className="login-form-container"
                    onSubmit={handleSubmit}
                  >
                    {error && (
                      <div className="error-message text-danger">{error}</div>
                    )}

                    <div className="form-row">
                      <div className="input-group">
                        <div className="input-group__label-wrapper">
                          <i className="ri-user-line icon"></i>
                          <label className="label">Username</label>
                        </div>
                        <div className="input-field">
                          <input
                            type="text"
                            className="input input--active"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                          />
                          {fieldErrors.username && (
                            <div className="field-error text-danger">
                              {fieldErrors.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="input-group input-field-bottom-space">
                        <div className="input-group__label-wrapper">
                          <i className="ri-lock-line icon"></i>
                          <label className="label">Password</label>
                        </div>
                        <div
                          className="input-field"
                          style={{ position: "relative" }}
                        >
                          <input
                            className="input input--active"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ paddingRight: "40px" }}
                          />

                          {formData.password !== "" && (
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                position: "absolute",
                                zIndex: 1,
                                right: "10px",
                                cursor: "pointer",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            >
                              {showPassword ? (
                                <i className="bi bi-eye-slash"></i>
                              ) : (
                                <i className="bi bi-eye"></i>
                              )}
                            </span>
                          )}

                          {fieldErrors.password && (
                            <div className="field-error text-danger">
                              {fieldErrors.password}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-actions login-action">
                      <button
                        type="submit"
                        className="button button--medium button--main login-button"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </form>

                  <div className="login-footer">
                    <p className="version">Alphaway Admin Panel Vs 1.0.1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="login-logo-circle"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="image-protector"></div>
            <img src={circlelogo} alt="Logo" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
