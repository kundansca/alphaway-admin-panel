import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import PartnerModal from "./partnersModal";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

function PartnerList() {
  const perPage = 10;
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;
  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setPartners(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = originalData.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.email || "").toLowerCase().includes(s) ||
        (p.university || "").toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Nationality",
      "City",
      "DOB",
      "University",
      "Campus",
      "Budget",
      "Comments",
      "Created Date & Time",
    ];
    const data = selectedRows.length
      ? originalData.filter((p) => selectedRows.includes(p.id))
      : originalData;
    const rows = data.map((p) => [
      p.id,
      p.name,
      p.email,
      p.phone,
      p.nationality,
      p.city,
      formatDateOnly(p.dob),

      p.university,
      p.campus,
      p.budget,
      p.comments || "",
      formatDate(p.createDate) || "N/A",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `partners_selected_${selectedRows.length}.csv`
      : "partner_list.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectAll = () => {
    if (!selectAll) setSelectedRows(partners.map((p) => p.id));
    else setSelectedRows([]);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const fetchPatnersList = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASEURL}/partner/student-info`, {
        headers: {
          Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      });
      const serverData = response.data.content || [];

      setFilteredData(serverData);
      setOriginalData(serverData);
    } catch (error) {
      setError("Failed to fetch partner data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatnersList();
  }, []);

  return (
    <Layout>
      <div className="container-fluid col-12 py-4">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Partner List</h1>
          </div>
          <div className="col-8 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email, university"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-success" onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>
          <div className="col-md-4 d-flex justify-content-end gap-1">
            <button
              className="btn btn-outline-secondary"
              onClick={handleExportCSV}
            >
              {selectedRows.length
                ? `Export CSV (${selectedRows.length})`
                : "Export CSV"}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedPartner(null);
                setShowModal(true);
              }}
            >
              <AddIcon /> Add
            </button>
          </div>
        </div>

        {/* Loader / Error / Table */}
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center my-4">{error}</div>
        ) : (
          <>
            <div className="table-responsive mt-4">
              <table className="table table-bordered table-hover align-middle">
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
                    <th>Name</th>
                    <th>Email</th>

                    <th>Nationality</th>
                    <th>City</th>
                    <th>University</th>
                    <th>Created Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.length > 0 ? (
                    partners.map((p, i) => (
                      <tr key={p.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(p.id)}
                            onChange={() => handleRowSelect(p.id)}
                          />
                        </td>
                        <td>{(currentPage - 1) * perPage + i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.email}</td>
                        <td>{p.nationality}</td>
                        <td>{p.city}</td>

                        <td>{p.university}</td>
                        <td>{formatDate(p.createDate)}</td>
                        <td>
                          <Link
                            className="btn btn-sm btn-outline-success"
                            to={`/partner-students/${p.id}`}
                            target="_blank"
                          >
                            View All Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={filteredData.length}
              itemsPerPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        <PartnerModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          partner={selectedPartner}
          mode={selectedPartner ? "view" : "add"}
        />
      </div>
    </Layout>
  );
}

export default PartnerList;
