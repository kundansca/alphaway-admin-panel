import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../layout/Index";

const BookingViewingDetails = () => {
  const [viewingData, setViewingData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookingviewing/1") // 👈 apna API endpoint
      .then((res) => {
        setViewingData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  //   if (!viewingData) {
  //     return <div className="container mt-5">Loading...</div>;
  //   }

  // ✅ Reusable card renderer
  const renderSection = (title, fields) => (
    <div className="card mb-4 shadow-sm">
      <div className="card-header fw-bold">{title}</div>
      <div className="card-body p-0">
        <table className="table table-striped table-bordered m-0">
          <tbody>
            {fields.map((field, index) => (
              <tr key={index}>
                <td className="fw-bold" style={{ width: "30%" }}>
                  {field.label}
                </td>
                <td>{field.value || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Booking Viewing Details</h2>

        {renderSection("Viewer Information", [
          { label: "First Name", value: viewingData?.firstName },
          { label: "Last Name", value: viewingData?.lastName },
          { label: "Email", value: viewingData?.email },
          { label: "Phone", value: viewingData?.phone },
          { label: "Viewer Name", value: viewingData?.viewerName },
        ])}

        {renderSection("Property Information", [
          { label: "Property ID", value: viewingData?.property?.id },
          { label: "Property Name", value: viewingData?.property?.name },
        ])}

        {renderSection("Room Information", [
          { label: "Room", value: viewingData?.room?.name || "Not Assigned" },
        ])}

        {renderSection("Viewing Schedule", [
          { label: "Viewing Date & Time", value: viewingData?.viewingDateTime },
        ])}
      </div>
    </Layout>
  );
};

export default BookingViewingDetails;
