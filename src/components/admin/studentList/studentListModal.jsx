import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const StudentsListModal = ({ show, handleClose, booking, mode }) => {
  const isViewMode = mode === "view";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    university: "",
    yearOfStudy: "",
    academicYear: ""
  });

  useEffect(() => {
    if (booking) {
      setForm({ ...booking });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        university: "",
        yearOfStudy: "",
        academicYear: ""
      });
    }
  }, [booking]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", form);
    handleClose(); // Optionally reset form or trigger save
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isViewMode ? "View Student Details" : "Add Student"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>University</Form.Label>
                <Form.Control
                  type="text"
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Year of Study</Form.Label>
                <Form.Control
                  type="text"
                  name="yearOfStudy"
                  value={form.yearOfStudy}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Academic Year</Form.Label>
                <Form.Control
                  type="text"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {isViewMode ? "Close" : "Cancel"}
        </Button>
        {!isViewMode && (
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default StudentsListModal;
