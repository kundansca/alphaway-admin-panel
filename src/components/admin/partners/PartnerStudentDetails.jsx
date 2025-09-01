import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "../../../layout/Index";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";
const PartnerStudentDetails = () => {
  const [studentData, setStudentData] = useState(null);
  const authData = useSelector((state) => state.auth);
  const { id } = useParams();
  const printRef = useRef();
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  // ✅ Date format function
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
  // ✅ Value check function
  const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Partner From Details",
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

  // ✅ API Call
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`${BASEURL}/partner/student-info/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.userData.accessToken}`,
          },
        });

        setStudentData(res.data);
      } catch (err) {}
    };
    fetchStudentData();
  }, [id, authData?.userData?.accessToken]);

  if (!studentData) {
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
          <h2 className="mb-4">Partner From Details</h2>
          <button
            className="btn btn-primary mb-3 no-print"
            onClick={handlePrint}
          >
            Print Form
          </button>

          {renderSection("Personal Information", [
            { label: "Name", value: studentData?.name },
            { label: "Email", value: studentData?.email },
            { label: "Phone", value: studentData?.phone },
            { label: "Date of Birth", value: formatDateOnly(studentData?.dob) },
            { label: "Nationality", value: studentData?.nationality },
          ])}

          {renderSection("Education & Preference", [
            { label: "University", value: studentData?.university },
            { label: "Campus", value: studentData?.campus },
            { label: "City", value: studentData?.city },
            { label: "Budget", value: studentData?.budget },
            { label: "Room Preference", value: studentData?.roomPreference },
            { label: "Partner Name", value: studentData?.partnerId },
          ])}

          {renderSection("System Info", [
            { label: "ID", value: studentData?.id },
            {
              label: "Created Date",
              value: formatDate(studentData?.createDate),
            },
          ])}
        </div>
      </div>
    </Layout>
  );
};

export default PartnerStudentDetails;
