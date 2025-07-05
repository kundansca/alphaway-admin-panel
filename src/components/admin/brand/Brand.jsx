import { useState, useEffect } from "react";
import axios from "axios";
import config from '../../../config/config';
import { apiRequestGet } from "../../../utils/ApiService";
import Pagination from '../../shared/Pagination';
// import SoftDeleteButton from '../../shared/SoftDeleteButton';
import Layout from "../../../layout/Index";
import BrandModal from './BrandModal';
import StatusBadge from "../../shared/StatusBadge";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";


const DEFAULT_IMAGE = config.DEFAULT_IMAGE;
const IMAGE_BASE_URL = config.IMAGE_BASE_URL;
function Brand() {
  const perPageLimit = 10;
  const apiServerUrl = config.api_server_url;
  const apiBaseUrl = config.api_base_url;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, settotalRecords] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequestGet("/brand/list", { page, perPageLimit: perPageLimit });
      console.log("Response:", response);
      const { data, pagination } = response.data;
      setData(data);
      settotalRecords(pagination.totalRecords);

    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveBrand = async (formData) => {
    try {
      if (editingBrand) {
        await axios.put(`${apiBaseUrl}/admin/brand/update/${editingBrand.id}`, formData);
      } else {
        await axios.post(`${apiBaseUrl}/admin/brand/create`, formData);
      }
      fetchData(currentPage);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid col-12">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Brand List</h1>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-success"><SearchIcon /></button>
          </div>
          <div className="col-2">
            <button className="btn btn-primary mb-4" onClick={handleOpenAddModal} ><AddIcon /></button>
          </div>


        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((brand, index) => (
                <tr key={brand.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a href={`${IMAGE_BASE_URL+brand.image}`} target="_BLANK"><img
  src={`${IMAGE_BASE_URL+brand.image}`}
  alt={brand.name}
  className="img-thumbnail w-25"
  onError={(e) => {
    e.target.onerror = null; // Prevents infinite loop
    e.target.src = DEFAULT_IMAGE; // Fallback image
  }}
/></a>
                  </td>
                  <td>{brand.name}</td>
                  <td><StatusBadge status={brand.status} /></td>
                  <td>
                    <button className="btn btn-sm btn-primary-outline" onClick={() => handleOpenEditModal(brand)}><EditIcon /></button>
                    <button className="btn btn-sm ms-4 btn-outline-danger"><DeleteIcon /></button>
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

        <BrandModal
          show={showModal}
          onHide={handleModalClose}
          onSave={handleSaveBrand}
          editingBrand={editingBrand}
        />
      </div>
    </Layout>
  );
}

export default Brand;
