import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../layout/Index';

const EnquiryViewDetails = () => {
  return (
    <>
    <Layout>
    <div className="container py-4" style={{minHeight:"90vh"}}>
     {/* <div className="bg-primary text-white text-center rounded p-3 mb-4 shadow-sm">
      <h2 className="m-0">Viewer Details</h2>
     </div> */}

      <div className="card shadow-sm">
         {/* 👇 Header inside the card */}
    <div className="card-header bg-primary text-white text-center rounded-top">
      <h2 className="m-0">Viewer Details</h2>
    </div>
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control disabled"
                  value="Carlos"
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control disabled"
                  value="Martinez"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className="form-control disabled"
                  value="+34 612345678"
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control disabled"
                  value="carlos.m@example.es"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                rows="6"
                className="form-control disabled"
                readOnly
                value={`I'm looking for a calm, peaceful neighborhood for long-term living. I work remotely, so a quiet environment with reliable internet is essential...`}
              disabled
              />
            </div>

            <Link to="/admin/enquiry" className="btn btn-secondary mt-3">Back to List</Link>
          </form>
        </div>
      </div>
    </div>
    </Layout>
    </>
  );
};

export default EnquiryViewDetails;
