import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function BookingModal({ show, handleClose, booking, mode }) {
  console.log(booking);
  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    university: "",
    yearOfStudy: "",
    academicYear: ""
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (mode === "view" && booking) {
      const dateOfBirth = "2010-08-03";
     const date = new Date(booking?.dateOfBirth);

 const options = { day: '2-digit', month: 'long', year: 'numeric' };
const formattedDate = date.toLocaleDateString('en-GB', options);
      setFormData({ ...initialForm, ...booking,university:booking?.university?.name,gender: booking?.gender?.description,dob:formattedDate});
    } else {
      setFormData(initialForm);
    }
  }, [booking, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
   
    // TODO: Handle API submission here
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {mode === "add" ? "Add New Booking" : `Booking Details`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter first name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type={mode === "view" && booking? "text":"date"}
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={mode === "view"}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>University</Form.Label>
                <Form.Control
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter university"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Year of Study</Form.Label>
                <Form.Control
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter year of study"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Academic Year</Form.Label>
                <Form.Control
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter academic year"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {mode === "view" ? "Close" : "Cancel"}
        </Button>
        {mode === "add" && (
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default BookingModal;
