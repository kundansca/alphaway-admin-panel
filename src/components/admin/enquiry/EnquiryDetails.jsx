import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "../../../layout/Index";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const EnquiryDetails = () => {
  const [enquiryData, setEnquiryData] = useState(null);
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

  // ✅ Value check function
  const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  // ✅ Print function
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "", "width=900,height=650");
    const printDoc = printWindow.document;
    const head = document.head.cloneNode(true);
    const bodyContent = printRef.current.cloneNode(true);

    printDoc.replaceChild(
      printDoc.createElement("html"),
      printDoc.documentElement
    );

    const html = printDoc.documentElement;
    html.appendChild(head);

    const body = printDoc.createElement("body");
    body.className = document.body.className;
    body.appendChild(bodyContent);

    html.appendChild(body);

    printDoc.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ✅ API Call
  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        const res = await axios.get(`${BASEURL}/enquiry/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.userData.accessToken}`,
          },
        });
        setEnquiryData(res.data);
      } catch (err) {}
    };
    fetchEnquiryData();
  }, [id, authData?.userData?.accessToken]);

  if (!enquiryData) {
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
      <div className="container mt-4" ref={printRef}>
        <h2 className="mb-4">Enquiry Details</h2>
        <button className="btn btn-primary mb-3" onClick={handlePrint}>
          Print Form
        </button>

        {renderSection("Enquiry Information", [
          { label: "First Name", value: enquiryData?.firstName },
          { label: "Last Name", value: enquiryData?.lastName },
          { label: "Email", value: enquiryData?.email },
          { label: "Phone", value: enquiryData?.phone },
          { label: "Message", value: enquiryData?.message },
          { label: "Property", value: enquiryData?.property?.name }, // null ho to N/A dikhega
          { label: "Enquiry Channel", value: enquiryData?.enquiryChannel },
        ])}

        {renderSection("System Info", [
          { label: "ID", value: enquiryData?.id },
          {
            label: "Created Date & Time",
            value: formatDate(enquiryData?.createDate),
          },
        ])}
      </div>
    </Layout>
  );
};

export default EnquiryDetails;
