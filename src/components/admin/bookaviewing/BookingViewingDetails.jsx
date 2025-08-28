import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "../../../layout/Index";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";

const BookingViewingDetails = () => {
  const [viewingData, setViewingData] = useState(null);
  const authData = useSelector((state) => state.auth);
  const { id } = useParams();
  const printRef = useRef();
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;
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
  // ✅ Function to show value or N/A
  const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Viewing From Details",
    pageStyle: `
       @page {
         size: auto;
         margin: 20mm;
       }
       body {
         font-family: Arial, sans-serif;
       }
     `,
  });
  useEffect(() => {
    const fetchViewingData = async () => {
      try {
        const res = await axios.get(`${BASEURL}/book/viewing/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.userData.accessToken}`,
          },
        });

        setViewingData(res.data);
      } catch (err) {}
    };
    fetchViewingData();
  }, [id, authData?.userData?.accessToken]);

  if (!viewingData) {
    return <div className="container mt-5">Loading...</div>;
  }

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
                <td>{showValue(field.value)}</td>
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
        <div ref={printRef}>
          <h2 className="mb-4">Viewing From Details</h2>
          <button
            className="btn btn-primary mb-3 no-print"
            onClick={handlePrint}
          >
            Print Form
          </button>

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
            {
              label: "Room ID",
              value: viewingData?.room?.id || "Not Assigned",
            },
          ])}

          {renderSection("Viewing Schedule", [
            {
              label: "Viewing Date & Time",
              value: formatDate(viewingData?.viewingDateTime),
            },
          ])}
          {renderSection("System Info", [
            { label: "ID", value: viewingData?.id },
            {
              label: "Create Date",
              value: formatDate(viewingData?.createDate),
            },
          ])}
        </div>
      </div>
    </Layout>
  );
};

export default BookingViewingDetails;
