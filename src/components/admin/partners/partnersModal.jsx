// src/components/partner/PartnerModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PartnerModal = ({ show, handleClose, partner, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    dob: "",
    city: "",
    university: "",
    campus: "",
    budget: "",
    comments: ""
  });

  useEffect(() => {
    if (mode === "view" && partner) {
      setFormData({ ...partner });
    } else if (mode === "add") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        nationality: "",
        dob: "",
        city: "",
        university: "",
        campus: "",
        budget: "",
        comments: ""
      });
    }
  }, [partner, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Partner:", formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {mode === "add" ? "Add Partner" : "Partner Details"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4">
        <Form>
          <div className="row g-3">
            {[
              "name", "email", "phone", "nationality", "dob",
              "city", "university", "campus", "budget", "comments"
            ].map(field => (
              <div className="col-md-6" key={field}>
                <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                {mode === "view" ? (
                  <div className="form-control-plaintext">{formData[field]}</div>
                ) : (
                  <Form.Control
                    type={field === "dob" ? "date" : field === "budget" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {mode === "add" && (
          <Button variant="primary" onClick={handleSubmit}>
            Save Partner
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PartnerModal;
