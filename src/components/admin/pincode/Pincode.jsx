import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";

import config from '../../../config/config';
import Pagination from '../../shared/Pagination';
import Layout from "../../../layout/Index";
import PincodeModal from "./PincodeModal";
import { apiRequestGet } from "../../../utils/ApiService";
import StatusBadge from "../../shared/StatusBadge";

function Pincode() {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;

  const [pincodes, setPincodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPincode, setEditingPincode] = useState(null);

  const fetchPincodes = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequestGet("/pincode/list", { page, perPageLimit: perPageLimit });

      const { data, pagination } = response.data;
      setPincodes(data);
      setTotalRecords(pagination.totalRecords);

    } catch (error) {
      console.error("Error fetching pincodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPincodes(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenAddModal = () => {
    setEditingPincode(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (pincode) => {
    setEditingPincode(pincode);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchPincodes(currentPage);
  };

  return (
    <Layout>
      <div className="container-fluid col-12">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Pincode List</h1>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-success"><SearchIcon /></button>
          </div>
          <div className="col-2">
            <button onClick={handleOpenAddModal} className="btn btn-primary mb-4"><AddIcon /></button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Area</th>
                <th>Pincode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pincodes.map((pin, index) => (
                <tr key={pin.id}>
                  <th>{index + 1}</th>
                  <td>{pin.area_name}</td>
                  <td>{pin.pincode}</td>
                  <td><StatusBadge status={pin.status} /></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(pin)}><EditIcon /></button>
                    <button className="btn btn-sm btn-outline-danger"><DeleteIcon /></button>
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

        {showModal && (
          <PincodeModal
            show={showModal}
            handleClose={handleModalClose}
            editingPincode={editingPincode}
          />
        )}
      </div>
    </Layout>
  );
}

export default Pincode;
