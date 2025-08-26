import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
        b.property?.name?.toLowerCase().includes(s)
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

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
      "Room ID",
      "Duration",
      "Special Requirements",
      "Postal Code",
      "Tenancy",
      "Deposit",
      "Payment Frequency",
      "Price",
      "Medical Condition",
      "Medical Condition Description",
      "Residential Phone",
      "Guarantor First Name",
      "Guarantor Last Name",
      "Guarantor Address1",
      "Guarantor Address2",
      "Guarantor City",
      "Guarantor Country",
      "Guarantor Postal Code",
      "Guarantor Email",
      "Guarantor Phone",
      "Emergency First Name",
      "Emergency Last Name",
      "Emergency Relationship",
      "Emergency Mobile Phone",
      "Emergency Day Phone",
      "Emergency Address1",
      "Emergency Address2",
      "Emergency City",
      "Emergency Country",
      "Emergency Postal Code",
      "Created Date",
    ];

    const data = selectedRows.length
      ? allBookings.filter((b) => selectedRows.includes(b.id))
      : allBookings;

    const rows = data.map((b) => [
      b.id ?? "N/A",
      b.firstName ?? "N/A",
      b.lastName ?? "N/A",
      b.email ?? "N/A",
      b.phone ?? "N/A",
      b.dateOfBirth ?? "N/A",
      b.gender?.name ?? "N/A",
      b.university?.name || b.universityOther || "N/A",
      b.academicYear ?? "N/A",
      b.yearOfStudy ?? "N/A",
      b.nationality ?? "N/A",
      b.religion ?? "N/A",
      `${b.address1 || "N/A"} ${b.address2 || ""}`.trim(),
      b.city ?? "N/A",
      b.country ?? "N/A",
      b.property?.name ?? "N/A",
      b.room?.id ?? "N/A",
      b.duration ?? "N/A",
      b.specialRequirements ?? "N/A",
      b.postalCode ?? "N/A",
      b.tenancy ?? "N/A",
      b.deposit ?? "N/A",
      b.paymentFrequency ?? "N/A",
      b.price ?? "N/A",
      b.medicalCondition !== undefined ? b.medicalCondition : "N/A",
      b.medicalConditionDescription ?? "N/A",
      b.residentialPhone ?? "N/A",
      b.guarantorFirstName ?? "N/A",
      b.guarantorLastName ?? "N/A",
      b.guarantorAddress1 ?? "N/A",
      b.guarantorAddress2 ?? "N/A",
      b.guarantorCity ?? "N/A",
      b.guarantorCountry ?? "N/A",
      b.guarantorPostalCode ?? "N/A",
      b.guarantorEmail ?? "N/A",
      b.guarantorPhone ?? "N/A",
      b.emergencyFirstName ?? "N/A",
      b.emergencyLastName ?? "N/A",
      b.emergencyRelationship ?? "N/A",
      b.emergencyMobilePhone ?? "N/A",
      b.emergencyDayPhone ?? "N/A",
      b.emergencyAddress1 ?? "N/A",
      b.emergencyAddress2 ?? "N/A",
      b.emergencyCity ?? "N/A",
      b.emergencyCountry ?? "N/A",
      b.emergencyPostalCode ?? "N/A",
      b.createDate ? new Date(b.createDate).toLocaleString() : "N/A",
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
              placeholder="Search name, email,property"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
            {/* <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedViewer(null);
                setShowModal(true);
              }}
            >
              <AddIcon /> Add
            </button> */}
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
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>City</th>
                    <th>Property</th>
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
                          {b.firstName}
                          {b.lastName}
                        </td>
                        <td>{b.email || "N/A"}</td>
                        <td>{b.country || "N/A"}</td>
                        <td>{b.city || "N/A"}</td>
                        <td>{b.property?.name || "N/A"}</td>
                        <td>
                          <td>
                            <Link
                              className="btn btn-sm btn-outline-success"
                              to={`/bookings/${b.id}`}
                              target="_blank"
                            >
                              View All Details
                            </Link>
                          </td>
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
      </div>
    </Layout>
  );
}

export default Bookings;
