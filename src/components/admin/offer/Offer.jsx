import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import config from '../../../config/config';
import { apiRequestGet } from "../../../utils/ApiService";
import Pagination from '../../shared/Pagination';
import Layout from "../../../layout/Index";
import AttributeModal from './OfferModal';
import StatusBadge from "../../shared/StatusBadge";
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";

function Attribute() {
    const perPageLimit = 10;
    const apiBaseUrl = config.api_base_url;
    const [data, setdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, settotalRecords] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const response = await apiRequestGet("/attribute/list", { page, perPageLimit: perPageLimit });

            const { data, pagination } = response.data;
            setdata(data);
            settotalRecords(pagination.totalRecords);
        } catch (error) {
            console.error("Error fetching Data:", error);
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
        setEditingAttribute(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (attr) => {
        setEditingAttribute(attr);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSaveAttribute = async (attributeData) => {
        try {
            if (editingAttribute) {
                await axios.put(`${apiBaseUrl}/attribute/update/${editingAttribute.id}`, attributeData);
            } else {
                await axios.post(`${apiBaseUrl}/attribute/create`, attributeData);
            }
            fetchData(currentPage);
            setShowModal(false);
        } catch (error) {
            console.error("Error saving attribute:", error);
        }
    };

    return (
        <Layout>
            <div className="container-fluid col-12">
                <div className="row">
                    <div className="col-10">
                        <h1 className="mt-4">Offer List</h1>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
                    </div>
                    <div className="col-4">
                        <button type="button" className="btn btn-success"><SearchIcon /></button>
                    </div>
                    <div className="col-2 d-flex justify-content ">
                        <button className="btn btn-primary mb-4" onClick={handleOpenAddModal} ><AddIcon /></button>

                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((datas, index) => (
                                <tr key={datas.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{datas.name}</td>
                                    <td><StatusBadge status={data.status} /></td>
                                    <td>
                                        <button className="btn btn-sm ms-4 btn-outline-primary" onClick={() => handleOpenEditModal(datas)}><EditIcon /></button>
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

                <AttributeModal
                    show={showModal}
                    onHide={handleModalClose}
                    onSave={handleSaveAttribute}
                    editingAttribute={editingAttribute}
                />
            </div>
        </Layout>
    );
}

export default Attribute;
