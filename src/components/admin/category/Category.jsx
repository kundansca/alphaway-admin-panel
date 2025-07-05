import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Pagination from '../../shared/Pagination';
import Layout from "../../../layout/Index";
import ToastMsg from '../../shared/ToastMsg';
import { apiRequestGet } from "../../../utils/ApiService";
import CategoryModal from './CategoryModal'; // Adjust path as needed
import StatusBadge from "../../shared/StatusBadge";
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";


function Category() {
    const perPage = 10;
    const [category, setCategory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    // Function to fetch users from the API
    const fetchCategory = async (page) => {
        setLoading(true); // Start loading
        try {

            const response = await apiRequestGet("/category/list", { page, perPageLimit: perPage });
            console.log("Response:", response);
            const { data, pagination } = response.data;
            setCategory(data);
            setTotalItems(pagination.totalRecords);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch users when the component mounts or page changes
    useEffect(() => {
        fetchCategory(currentPage);
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);

    };


    const handleOpenAddModal = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };
    return (
        <Layout>
            <div className="container-fluid col-12">
                <div className="row "  >
                    <div className="col-10">
                        <h1 className="mt-4">Category List</h1>
                    </div>
                    <div className="col-6">
                        <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
                    </div>
                    <div className="col-4">
                        <button type="button" className="btn btn-success"><SearchIcon /></button>
                    </div>
                    <div className="col-2 d-flex justify-content ">
                        <button className="btn btn-primary " onClick={handleOpenAddModal} ><AddIcon /></button>

                    </div>

                </div>
                <div className="table-responsive mt-4">
                    <table className="table table-striped table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                {/* <th scope="col">Parent ID</th> */}
                                <th scope="col">Name</th>
                                <th scope="col">Parent</th>
                                <th scope="col">Image </th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.map((category, index) => (
                                <tr key={category.id}> {/* Assuming each user has a unique 'id' */}
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.name}</td>
                                    <td>{category.cat_id}</td>
                                    <td>{category.image}</td>
                                    <td> <StatusBadge status={category.status} /> </td>
                                    <td>
                                        <button
                                            className="btn btn-sm ms-4 btn-outline-primary"
                                            onClick={() => handleOpenEditModal(category)}
                                        ><EditIcon /> </button>
                                        <button className="btn btn-sm ms-4 btn-outline-danger"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                {/* Pagination controls */}
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={perPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />


                <CategoryModal
                    show={showModal}
                    handleClose={handleModalClose}
                    // handleSave={handleSaveCategory}
                    category={editingCategory}
                />
            </div>

        </Layout>
    );
}

export default Category;
