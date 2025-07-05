import React, { useState, useEffect } from 'react';
import config from '../../../config/config';

import { Modal, Button, Form } from 'react-bootstrap';
import { apiRequestPost } from '../../../utils/ApiService';
import ToastMsg from '../../shared/ToastMsg';
const DEFAULT_IMAGE = config.DEFAULT_IMAGE;
const IMAGE_BASE_URL = config.IMAGE_BASE_URL;
function BrandModal({ show, onHide, editingBrand }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Active');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingBrand) {
            setName(editingBrand.name || '');
            setStatus(editingBrand.status || 'Act1ive');
            setImagePreview(IMAGE_BASE_URL+editingBrand.image || null);
        } else {
            setName('');
            setStatus('1');
            setImage(null);
            setImagePreview(null);
        }
        setErrors({});
    }, [editingBrand]);

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Brand name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('status', status);
            if (image) formData.append('image', image);
            if (editingBrand?.id) formData.append('id', editingBrand.id); // if updating

            const endpoint = editingBrand ? '/brand/update' : '/brand/addnew';
            const response = await apiRequestPost(endpoint, formData, true);

            if (response.status) {
                ToastMsg(editingBrand ? 'Brand updated successfully' : 'Brand created successfully', 'success');
                onHide();
            } else {
                ToastMsg(response.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Brand submission error:', error);
            ToastMsg('Error submitting form', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{editingBrand ? 'Edit Brand' : 'Add Brand'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Brand Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter brand name"
                            isInvalid={!!errors.name}
                            
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Brand Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                        {imagePreview && (
                           
                            <img
  src={imagePreview}
  alt={name}
  className="img-thumbnail w-25"
  onError={(e) => {
    e.target.onerror = null; // Prevents infinite loop
    e.target.src = DEFAULT_IMAGE; // Fallback image
  }}
/>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingBrand ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default BrandModal;
