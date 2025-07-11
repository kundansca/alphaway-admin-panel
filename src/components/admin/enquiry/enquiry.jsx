import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import EnquiryModal from "./enquiryModal";
import axios from "axios";
import { useSelector } from "react-redux";

function EnquiryList() {
  const perPage = 10;
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // for export & search
  const [viewers, setViewers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedViewer, setSelectedViewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setViewers(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = originalData.filter((b) =>
      (b.firstName || "").toLowerCase().includes(s) ||
      (b.lastName || "").toLowerCase().includes(s) ||
      (b.email || "").toLowerCase().includes(s) ||
      (b.phone || "").toLowerCase().includes(s) ||
      (b.message || "").toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Message"];
    const data = selectedRows.length
      ? originalData.filter((b, i) => selectedRows.includes(b.id || i + 1))
      : originalData;
    const rows = data.map((b, i) => [
      b.id || i + 1,
      b.firstName || "",
      b.lastName || "",
      b.email || "",
      b.phone || "",
      b.message || ""
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `enquiry_selected_List${selectedRows.length}.csv`
      : "enquiry_List.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectAll = () => {
    if (!selectAll) setSelectedRows(viewers.map((v, i) => v.id || i + 1));
    else setSelectedRows([]);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = id => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  async function fetchEnquiry() {
    setLoading(true);
    setError("");
    try {
      let response = await axios.get(`${BASEURL}/enquiry`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      const serverData = response.data.content || [];
      setFilteredData(serverData);
      setOriginalData(serverData);
    } catch (error) {
     
      setError("Failed to fetch enquiry data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEnquiry();
  }, []);

  return (
    <Layout>
      <div className="container-fluid col-12 py-4">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Enquiry List</h1>
          </div>
          <div className="col-8 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email, phone, message"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-success" onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>

          <div className="col-md-4 d-flex justify-content-end gap-1">
            <button className="btn btn-success" onClick={handleExportCSV}>
              {selectedRows.length
                ? `Export CSV (${selectedRows.length})`
                : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Loader or Error */}
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
            {/* Table */}
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
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewers.length > 0 ? (
                    viewers.map((b, i) => (
                      <tr key={b.id || i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(b.id || i + 1)}
                            onChange={() => handleRowSelect(b.id || i + 1)}
                          />
                        </td>
                        <td>{(currentPage - 1) * perPage + i + 1}</td>
                        <td>{(b.firstName || "") + " " + (b.lastName || "")}</td>
                        <td>{b.email || "-"}</td>
                        <td>{b.phone || "-"}</td>
                        <td>{truncateText(b.message)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedViewer(b);
                              setShowModal(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              totalItems={filteredData.length}
              itemsPerPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        {/* Modal */}
        <EnquiryModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          booking={selectedViewer}
          mode={selectedViewer ? "view" : "add"}
        />
      </div>
    </Layout>
  );
}

export default EnquiryList;
