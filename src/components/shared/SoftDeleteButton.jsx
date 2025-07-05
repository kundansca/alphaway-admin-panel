import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SoftDeleteButton = (apiUrl, id) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSoftDelete = async () => {
    try {
      await axios.patch(`${apiUrl}/${id}`);
      setShowModal(false); // Close the modal
      alert('Brand soft deleted successfully!');
    } catch (error) {
      console.error('Error soft deleting the brand:', error);
      alert('Failed to soft delete the brand.');
    }
  };

  return (
    <div>
      <Link variant="danger" className="btn btn-sm btn-danger" onClick={handleShow}>
        <i className="fa fa-trash btn-sm"></i>
      </Link>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSoftDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SoftDeleteButton;
