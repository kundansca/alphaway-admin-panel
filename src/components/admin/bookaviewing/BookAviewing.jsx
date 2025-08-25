import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

function BookAViewing() {
  const perPage = 10;
  const authData = useSelector((state) => state.auth);
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  const [allViewers, setAllViewers] = useState([]);
  const [paginatedViewers, setPaginatedViewers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch API Data
  const fetchBookingViewers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASEURL}/book/viewing`, {
        headers: {
          Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      });

      const data = response.data.content || [];
      setAllViewers(data);
      setCurrentPage(1);
    } catch (err) {
      setError("⚠️ Unable to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingViewers();
  }, []);

  // Pagination & Search Logic
  useEffect(() => {
    const query = searchVal.trim().toLowerCase();
    const filtered = allViewers.filter((viewer) => {
      return (
        viewer.firstName?.toLowerCase().includes(query) ||
        viewer.lastName?.toLowerCase().includes(query) ||
        viewer.email?.toLowerCase().includes(query)
      );
    });

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    setPaginatedViewers(filtered.slice(start, end));
    setSelectedRows([]);
    setSelectAll(false);
  }, [allViewers, searchVal, currentPage]);

  const handleSelectAll = () => {
    const allIds = paginatedViewers.map((v) => v.id);
    setSelectedRows(selectAll ? [] : allIds);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Viewer Name",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Room Type",
      "Property Name",
      "Viewing Date",
      "Created Date & Time",
    ];

    const exportData = selectedRows.length
      ? allViewers.filter((v) => selectedRows.includes(v.id))
      : allViewers;

    const rows = exportData.map((v) => [
      v.viewerName || "N/A",
      v.firstName || "N/A",
      v.lastName || "N/A",
      v.email || "N/A",
      v.phone || "N/A",
      v.room?.id ? `Room #${v.room.id}` : "N/A",
      v.property?.name || "N/A",
      v.viewingDateTime
        ? new Date(v.viewingDateTime).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      v.createDate
        ? new Date(v.createDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "book_a_viewing_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="container-fluid col-12">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Book A Viewing List</h1>
          </div>
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name, Email"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
              disabled={!!error}
            />
          </div>
          <div className="col-4">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setCurrentPage(1)}
              disabled={!!error}
            >
              <SearchIcon />
            </button>
          </div>
          <div className="col-2 d-flex justify-content gap-1 mt-3 mt-md-0">
            <button
              className="btn btn-outline-secondary"
              onClick={handleExportCSV}
              disabled={!!error}
            >
              {selectedRows.length > 0
                ? `Export CSV (${selectedRows.length} Selected)`
                : "Export CSV"}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedViewer(null);
                setShowModal(true);
              }}
              disabled={!!error}
            >
              <AddIcon /> Add
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger my-4 text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="table-responsive mt-4">
              <table className="table table-striped table-hover table-bordered align-middle">
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
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Viewing Date</th>
                    <th>Created Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedViewers.length > 0 ? (
                    paginatedViewers.map((viewer, index) => {
                      const fullName =
                        `${viewer.firstName || ""} ${
                          viewer.lastName || ""
                        }`.trim() || "N/A";

                      const email = viewer.email || "N/A";

                      const viewingDate = viewer.viewingDateTime
                        ? new Date(viewer.viewingDateTime).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A";
                      const createdDateAndTime = viewer.createDate
                        ? new Date(viewer.createDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A";

                      return (
                        <tr key={viewer.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(viewer.id)}
                              onChange={() => handleRowSelect(viewer.id)}
                            />
                          </td>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>

                          <td>{fullName}</td>
                          <td>{email}</td>

                          <td>{viewingDate}</td>
                          <td>{createdDateAndTime}</td>
                          <td>
                            <Link
                              className="btn btn-sm btn-outline-success"
                              to={`/viewing-booking/${viewer.id}`}
                              target="_blank"
                            >
                              View All Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={
                allViewers.filter((viewer) =>
                  `${viewer.firstName || ""} ${viewer.lastName || ""} ${
                    viewer.email || ""
                  } ${viewer.phone || ""} ${viewer.viewerName || ""}`
                    .toLowerCase()
                    .includes(searchVal.toLowerCase())
                ).length
              }
              itemsPerPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>
    </Layout>
  );
}

export default BookAViewing;
