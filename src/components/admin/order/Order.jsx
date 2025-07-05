import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ViewIcon, EditIcon, DeleteIcon, AddIcon, SearchIcon } from "../../../config/Icons";


import config from '../../../config/config';
import { apiRequestGet } from "../../../utils/ApiService";
import Pagination from '../../shared/Pagination';
import Layout from "../../../layout/Index";
import StatusBadge from "../../shared/StatusBadge";

function Order() {
  const perPageLimit = 10;
  const apiBaseUrl = config.api_base_url;
  const [data, setData] = useState([]); // State to store user data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalRecords, setTotalRecords] = useState(1); // Current page
  // const [perPageLimit, setperPageLimit] = useState(10); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [loading, setLoading] = useState(false); // Loading state

  // Function to fetch users from the API
  const fetchData = async (page) => {
    setLoading(true); // Start loading
    try {

      const response = await apiRequestGet("/order/list", { page, perPageLimit: perPageLimit }); // Send pagination parameters
      console.log("Response:", response);

      // const { data } = response.data;
      // setData(data.data); // Set user data
      // settotalRecords(data.pagination.totalRecords);
      // setcurrentPage(data.pagination.currentPage);

      const { data, pagination } = response.data;
      setData(data);
      setTotalRecords(pagination.totalRecords);

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch users when the component mounts or page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Layout>
      <div className="container-fluid col-12">
        <h1 className="mt-5">Orders List</h1>
        <div className="row">
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Name, Email, Mobile" />
          </div>
          <div className="col-6 mb-3">
            <button type="button" className="btn btn-success"><SearchIcon /></button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">OrderID</th>
                <th scope="col">Total Item</th>
                <th scope="col">Total Price</th>
                <th scope="col">Customer Name</th>
                <th scope="col"> Email</th>
                <th scope="col"> Mobile</th>
                <th scope="col">Status</th>
                <th scope="col">Payment Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((dataVal, index) => (
                <tr key={dataVal.id}> {/* Assuming each user has a unique 'id' */}
                  <th scope="row">{index + 1}</th>
                  <td>{dataVal.order_id}</td>
                  <td>{dataVal.total_item}</td>
                  <td>{dataVal.total_amount}</td>
                  <td>{dataVal.name}</td>
                  <td>{dataVal.email}</td>
                  <td>{dataVal.mobile}</td>
                  <td><StatusBadge status={dataVal.status} /></td>
                  <td><StatusBadge status={dataVal.payment_status} /></td>
                  {/* <td>{dataVal.status}</td> */}
                  {/* <td>{dataVal.payment_status}</td> */}
                  {/* <td>{dataVal.status}</td> */}
                  {/* <td>{dataVal.payment_status}</td> */}
                  <td>
                    <button className="btn btn-sm ms-4 btn-outline-primary"><ViewIcon /></button>
                    <button className="btn btn-sm ms-4 btn-outline-danger"><DeleteIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        {/* Pagination controls */}
        <Pagination
          totalItems={totalRecords}
          itemsPerPage={perPageLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </Layout>
  );
}

export default Order;
