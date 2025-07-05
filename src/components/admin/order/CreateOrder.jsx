import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config/config';
import { apiRequestGet } from '../../../utils/ApiService';
import Layout from "../../../layout/Index";
const Create = () => {
  const apiBaseUrl = config.api_base_url;

  const [id, setId] = useState('');
  const [toralitem, setToralitem] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send POST request to the API
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      const urlencoded = new URLSearchParams();
      urlencoded.append("id", id);
      urlencoded.append("orderID", orderID);
      urlencoded.append("toralitem", toralitem);


      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      const response = await fetch(`${apiBaseUrl}/login`, requestOptions);
      const data = await response.json();

      if (data.status) {
        // Save authentication token
        localStorage.setItem("auth", JSON.stringify(data.data));
      } else {
        // Handle API errors
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network errors
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="container-fluid col-12">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Product Details</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="id"
                      name="id"
                      type="text"
                      placeholder="ID"
                      aria-label="ID"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                    <label htmlFor="id">ID</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="orderID"
                      name="orderID"
                      type="text"
                      placeholder="orderID"
                      aria-label="orderID"
                      value={orderID}
                      onChange={(e) => setOrderID(e.target.value)}
                      required
                    />
                    <label htmlFor="orderID">OrderID</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="toralitem"
                      name="toralitem"
                      type="text"
                      placeholder="toralitem"
                      aria-label="toralitem"
                      value={toralitem}
                      onChange={(e) => setToralitem(e.target.value)}
                      required
                    />
                    <label htmlFor="uesername">Toral Item	</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="toralprice"
                      name="toralprice"
                      type="text"
                      placeholder="toralprice"
                      aria-label="toralprice"
                      value={toralprice}
                      onChange={(e) => setToralprice(e.target.value)}
                      required
                    />
                    <label htmlFor="toralprice">Toralprice</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="customername"
                      name="customername"
                      type="text"
                      placeholder="customername"
                      aria-label="nacustomernameme"
                      value={customername}
                      onChange={(e) => setCustomername(e.target.value)}
                      required
                    />
                    <label htmlFor="name">Customer Name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Email"
                      aria-label="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      type="phone"
                      placeholder="Mobile"
                      aria-label="mobile"
                      value={mobile}
                      onChange={(e) => setmobile(e.target.value)}
                      required
                    />
                    <label htmlFor="mobile">Mobile</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="paymentstaus"
                      name="paymentstaus"
                      type="text"
                      placeholder="paymentstaus"
                      aria-label="paymentstaus"
                      value={paymentstaus}
                      onChange={(e) => setPaymentStaus(e.target.value)}
                      required
                    />
                    <label htmlFor="status">Payment Status</label>
                  </div>



                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
