import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../layout/Index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./BookingFormFullDisplay.css";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const BookingFormFullDisplay = () => {
  const [formData, setFormData] = useState(null);
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
  useEffect(() => {
    const fetchBookingForm = async () => {
      try {
        const res = await axios.get(`${BASEURL}/book/viewing/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.userData.accessToken}`,
          },
        });

        setFormData(res.data);
      } catch (err) {}
    };
    fetchBookingForm();
  }, [id, authData?.userData?.accessToken]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Booking Form Details",
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

  if (!formData) {
    return <div className="container mt-5">Loading...</div>;
  }

  // ✅ Function to show value or N/A
  const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

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
          <h2 className="mb-4">Booking Form Details</h2>

          <button className="global-button mb-3 no-print" onClick={handlePrint}>
            Print Form
          </button>

          {renderSection("Personal Information", [
            { label: "First Name", value: formData?.firstName },
            { label: "Last Name", value: formData?.lastName },
            { label: "Gender", value: formData?.gender?.description },
            { label: "Date of Birth", value: formData?.dateOfBirth },
            { label: "Nationality", value: formData?.nationality },
            { label: "Religion", value: formData?.religion },
          ])}

          {renderSection("Contact Information", [
            { label: "Email", value: formData?.email },
            { label: "Phone", value: formData?.phone },
            { label: "Residential Phone", value: formData?.residentialPhone },
          ])}

          {renderSection("Address", [
            { label: "Address 1", value: formData?.address1 },
            { label: "Address 2", value: formData?.address2 },
            { label: "City", value: formData?.city },
            { label: "Country", value: formData?.country },
            { label: "Postal Code", value: formData?.postalCode },
          ])}

          {renderSection("Academic Information", [
            { label: "Academic Year", value: formData?.academicYear },
            {
              label: "University",
              value: formData?.universityOther || formData?.university?.name,
            },
            { label: "Year of Study", value: formData?.yearOfStudy },
          ])}

          {renderSection("Emergency Contact", [
            { label: "First Name", value: formData?.emergencyFirstName },
            { label: "Last Name", value: formData?.emergencyLastName },
            { label: "Relationship", value: formData?.emergencyRelationship },
            { label: "Day Phone", value: formData?.emergencyDayPhone },
            { label: "Mobile Phone", value: formData?.emergencyMobilePhone },
            { label: "Address", value: formData?.emergencyAddress1 },
          ])}

          {renderSection("Guarantor", [
            { label: "First Name", value: formData?.guarantorFirstName },
            { label: "Last Name", value: formData?.guarantorLastName },
            { label: "Email", value: formData?.guarantorEmail },
            { label: "Phone", value: formData?.guarantorPhone },
            { label: "Address", value: formData?.guarantorAddress1 },
          ])}

          {renderSection("Medical Information", [
            {
              label: "Medical Condition",
              value: formData?.medicalCondition ? "Yes" : "No",
            },
            {
              label: "Description",
              value: formData?.medicalConditionDescription,
            },
          ])}

          {renderSection("Other Details", [
            { label: "Deposit", value: formData?.deposit },
            { label: "Duration", value: formData?.duration },
            { label: "Price", value: formData?.price },
            { label: "Payment Frequency", value: formData?.paymentFrequency },
            {
              label: "Special Requirements",
              value: formData?.specialRequirements,
            },
            { label: "Tenancy", value: formData?.tenancy },
          ])}
          {renderSection("Property & Room", [
            { label: "Property Name", value: formData?.property?.name },
            { label: "Room ID", value: formData?.room?.id },
          ])}

          {renderSection("System Info", [
            { label: "ID", value: formData?.id },
            { label: "Create Date", value: formatDate(formData?.createDate) },
          ])}
        </div>
      </div>
    </Layout>
  );
};

export default BookingFormFullDisplay;
