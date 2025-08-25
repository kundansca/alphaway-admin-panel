import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import BookingModal from "./bookingModal";
import axios from "axios";
import { useSelector } from "react-redux";

function Bookings() {
  const perPage = 10;
  const [allBookings, setAllBookings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedViewer, setSelectedViewer] = useState(null);
  let authData = useSelector((state) => {
    return state.auth;
  });
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASEURL}/booking/forms`,

          {
            headers: {
              Authorization: `Bearer ${authData.userData.accessToken}`,
            },
          }
        );

        const data = response.data.content;
        setAllBookings(data);
        setFilteredData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Update viewers on page change
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setViewers(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  // ✅ Search handler
  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = allBookings.filter(
      (b) =>
        b.firstName?.toLowerCase().includes(s) ||
        b.lastName?.toLowerCase().includes(s) ||
        b.email?.toLowerCase().includes(s) ||
        b.phone?.toLowerCase().includes(s) ||
        b.university?.name?.toLowerCase().includes(s) ||
        b.property?.name?.toLowerCase().includes(s) ||
        b.gender?.name?.toLowerCase().includes(s) ||
        b.nationality?.toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  // ✅ Export selected/all bookings to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "DOB",
      "Gender",
      "University",
      "Academic Year",
      "Year of Study",
      "Nationality",
      "Religion",
      "Address",
      "City",
      "Country",
      "Property",
    ];

    const data = selectedRows.length
      ? allBookings.filter((b) => selectedRows.includes(b.id))
      : allBookings;

    const rows = data.map((b) => [
      b.id,
      b.firstName,
      b.lastName,
      b.email,
      b.phone,
      b.dateOfBirth,
      b.gender?.name,
      b.university?.name || b.universityOther,
      b.academicYear,
      b.yearOfStudy,
      b.nationality,
      b.religion,
      `${b.address1} ${b.address2}`,
      b.city,
      b.country,
      b.property?.name,
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `bookings_selected_${selectedRows.length}.csv`
      : "bookings.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ✅ Select all rows
  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedRows(viewers.map((v) => v.id));
    } else {
      setSelectedRows([]);
    }
    setSelectAll(!selectAll);
  };

  // ✅ Toggle select single row
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="container-fluid col-12 py-4">
        <div className="row">
          <div className="col-10">
            <h1 className="mt-4">Booking List</h1>
          </div>

          <div className="col-8 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email, phone, uni"
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
                setSelectedViewer(null);
                setShowModal(true);
              }}
            >
              <AddIcon /> Add
            </button>
          </div>
        </div>

        {/* ✅ Loader */}
        {loading ? (
          <div className="text-center my-5">Loading Bookings...</div>
        ) : (
          <>
            {/* ✅ Table */}
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
                    <th>Gender</th>
                    <th>Property</th>
                    <th>University</th>
                    <th>Nationality</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewers.length > 0 ? (
                    viewers.map((b, i) => (
                      <tr key={b.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(b.id)}
                            onChange={() => handleRowSelect(b.id)}
                          />
                        </td>
                        <td>{(currentPage - 1) * perPage + i + 1}</td>
                        <td>
                          {b.firstName} {b.lastName}
                        </td>
                        <td>{b.email}</td>
                        <td>{b.phone}</td>
                        <td>{b.gender?.name}</td>
                        <td>{b.property?.name}</td>
                        <td>{b.university?.name || b.universityOther}</td>
                        <td>{b.nationality}</td>
                        <td>{b.city}</td>
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
                      <td colSpan="11" className="text-center">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            <Pagination
              totalItems={filteredData.length}
              itemsPerPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        {/* ✅ Modal */}
        <BookingModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          booking={selectedViewer}
          mode={selectedViewer ? "view" : "add"}
        />
      </div>
    </Layout>
  );
}

export default Bookings;
