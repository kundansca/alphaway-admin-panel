import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryModal = ({ show, handleClose, category }) => {
  const [form, setForm] = useState({ name: '', status: 1, image: '' });

  useEffect(() => {
    if (category) {
      setForm({ name: category.name, status: category.status, image: category.image || '' });
    } else {
      setForm({ name: '', status: 1, image: '' });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{category ? 'Edit' : 'Add'} Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="categoryName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </Form.Group>

          <Form.Group controlId="categoryStatus" className="mb-3">
            <Form.Label>Category Type</Form.Label>
            <Form.Select
              name="category_Type"
              value={form.status}
              onChange={handleChange}
            >
              <option value={1}>Main</option>
              <option value={0}>Sub Category</option>
            </Form.Select>
          </Form.Group>
          

          <Form.Group controlId="categoryStatus" className="mb-3">
            <Form.Label>Select Main Category</Form.Label>
            <Form.Select
              name="category_id"
              value={form.status}
              onChange={handleChange}
            >
              <option value={1}>Main</option>
              <option value={0}>Sub Category</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="categoryStatus" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="categoryImage" className="mb-3">
            <Form.Label>Image</Form.Label>
            {
              category == "Edit" &&
               <Form.Control
              type="file"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
            }
           
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
