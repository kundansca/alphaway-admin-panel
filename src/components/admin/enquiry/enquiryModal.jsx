import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function EnquiryModal({ show, handleClose, booking, mode }) {
  const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (mode === "view" && booking) {
      setFormData({ ...initialForm, ...booking });
    } else {
      setFormData(initialForm);
    }
  }, [booking, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted:", formData);
    // TODO: Handle API submission here
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {mode === "add" ? "Contact Form Submission" : `Viewer Details`}
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
            <Col md={12}>
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
            <Col md={12}>
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
          </Row>

          <Row className="mb-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={10}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="Enter your message"
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

export default EnquiryModal;
