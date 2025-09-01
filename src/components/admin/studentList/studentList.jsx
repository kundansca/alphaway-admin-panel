import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Index";
import Pagination from "../../shared/Pagination";
import studentData from "../../../dummy-data/students.json";
import { AddIcon, SearchIcon } from "../../../config/Icons";
import StudentModal from "./studentListModal";

function StudentList() {
  const perPage = 10;
  const [filteredData, setFilteredData] = useState(studentData);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setStudents(filteredData.slice(start, start + perPage));
    setSelectAll(false);
    setSelectedRows([]);
  }, [filteredData, currentPage]);

  const handleSearch = () => {
    const s = searchVal.toLowerCase();
    const result = studentData.filter(
      (b) =>
        b.firstName?.toLowerCase().includes(s) ||
        b.lastName?.toLowerCase().includes(s) ||
        b.email?.toLowerCase().includes(s) ||
        b.phone?.toLowerCase().includes(s) ||
        b.university?.toLowerCase().includes(s)
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
      "Year of Study",
      "Academic Year",
    ];
    const data = selectedRows.length
      ? studentData.filter((b) => selectedRows.includes(b.id))
      : studentData;
    const rows = data.map((b) => [
      b.id,
      b.firstName,
      b.lastName,
      b.email,
      b.phone,
      b.dob,
      b.gender,
      b.university,
      b.yearOfStudy,
      b.academicYear,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedRows.length
      ? `students_selected_${selectedRows.length}.csv`
      : "students_List.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelectAll = () => {
    if (!selectAll) setSelectedRows(students.map((v) => v.id));
    else setSelectedRows([]);
    setSelectAll(!selectAll);
  };

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
            <h1 className="mt-4">Student List</h1>
          </div>
          <div className="col-8 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search name, email, phone, university"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="global-button" onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>
          <div className="col-md-4 d-flex justify-content-end gap-1">
            <button className="global-button" onClick={handleExportCSV}>
              {selectedRows.length
                ? `Export CSV (${selectedRows.length})`
                : "Export CSV"}
            </button>
            <button
              className="global-button"
              onClick={() => {
                setSelectedStudent(null);
                setShowModal(true);
              }}
            >
              <AddIcon /> Add
            </button>
          </div>
        </div>

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
                <th>University</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((b, i) => (
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
                    <td>{b.university}</td>
                    <td>{b.dob}</td>
                    <td>{b.gender}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedStudent(b);
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

        <StudentModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          booking={selectedStudent}
          mode={selectedStudent ? "view" : "add"}
        />
      </div>
    </Layout>
  );
}

export default StudentList;
