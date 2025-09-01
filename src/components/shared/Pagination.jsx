import React from "react";
import "./pagination.css"; // Correct import
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate an array of page numbers for pagination
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={
              number === currentPage ? "page-item active" : "page-item"
            }
          >
            <a
              href="#!"
              onClick={() => setCurrentPage(number)}
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
        {/* <li className="page-item">
          <select >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          </select>
          </li> */}
        <li className="page-item">Total Records {totalItems}</li>
      </ul>
    </nav>
  );
};

export default Pagination;
