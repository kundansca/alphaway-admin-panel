import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {apiRequestPost} from "../../../utils/ApiService"
import config from "../../../config/config";
import ToastMsg from "../../shared/ToastMsg";

const DEFAULT_IMAGE = config.DEFAULT_IMAGE;
const IMAGE_BASE_URL = config.IMAGE_BASE_URL;
const AdminModal = ({ show, handleClose, user }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    role_id: '1',
    status: '1',
    image: null,
    imagePreview: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
        const imgUrl = IMAGE_BASE_URL+user.image;
      setForm({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        username: user.username || '',
        password: '',
        role_id: user.role_id || '1',
        status: user.status?.toString() || '1',
        image: null,
        imagePreview: imgUrl || DEFAULT_IMAGE,
      });
    } else {
      setForm({
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        role_id: '1',
        status: '1',
        image: null,
        imagePreview: ''
      });
    }
    setErrors({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!user && !form.password.trim()) newErrors.password = 'Password is required'; // Only on add
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in form) {
      if (key !== 'imagePreview' && form[key] !== null) {
        formData.append(key, form[key]);
      }
    }
    // formData.id = user.id;
    const endpoint = user ? `/emp/update` : "/emp/addnew";
    const apiResData = await apiRequestPost(endpoint, formData, true);
    if(apiResData.status){
        ToastMsg(
                    user ? "Updated successfully" : "Created successfully",
                    "success"
                );
        handleClose();
    } else {
        ToastMsg("SOme validation issue");
    }
    
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Edit Admin' : 'Add Admin'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[
            // { label: 'id', name: 'id', type: 'text' },
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Mobile', name: 'mobile', type: 'text' },
            { label: 'Username', name: 'username', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' }
          ].map((field) => (
            <Form.Group as={Row} className="mb-2" key={field.name}>
              <Form.Label column sm={3}>{field.label}</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  isInvalid={!!errors[field.name]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors[field.name]}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          ))}

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Profile Image</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {form.imagePreview && (
                <img src={form.imagePreview}  alt={form.name}  className="img-thumb w-25"
                    onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop
                        e.target.src = DEFAULT_IMAGE; // Fallback image
                    }}
                    />
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={3}>Role</Form.Label>
            <Col sm={9}>
              <Form.Select name="role_id" value={form.role_id} onChange={handleChange}>
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3">Editor</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={3}>Status</Form.Label>
            <Col sm={9}>
              <Form.Select name="status" value={form.status} onChange={handleChange}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminModal;
