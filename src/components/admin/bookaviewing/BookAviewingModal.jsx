import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const BookAViewingModal = ({ show, handleClose, bookAViewing }) => {

  const [form, setForm] = useState({
    viewerName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    viewingDate: '',
    roomType: '',
    tenancy: ''
  });

  function formatDateTime(datetimeString) {
  if (!datetimeString) return "N/A";
  const date = new Date(datetimeString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
  useEffect(() => {
    if (bookAViewing) {
   
       
      setForm({
        viewerName: bookAViewing.viewerName || '',
        firstName: bookAViewing.firstName || '',
        lastName: bookAViewing.lastName || '',
        email: bookAViewing.email || '',
        phone: bookAViewing.phone || '',
        viewingDate: formatDateTime(bookAViewing.viewingDateTime),
        roomType:bookAViewing.room?.id ? `Room #${bookAViewing.room.id}` : '',
        tenancy: bookAViewing.property.name || ''
      });
    } else {
      // Reset form if no booking is passed (e.g. on "Add" click)
      setForm({
        viewerName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        viewingDate: '',
        roomType: '',
        tenancy: ''
      });
    }
  }, [bookAViewing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    
    // You can handle API submission or parent callback here
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{bookAViewing ? 'Edit Viewer Details' : 'Add Viewer'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Viewer Name</Form.Label>
              <Form.Control
                type="text"
                name="viewerName"
                value={form.viewerName}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Viewing Date</Form.Label>
              <Form.Control
                type="text"
                name="viewingDate"
                value={form.viewingDate}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Room Type</Form.Label>
              <Form.Control
                type="text"
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Tenancy</Form.Label>
              <Form.Control
                type="text"
                name="tenancy"
                value={form.tenancy}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookAViewingModal;

