import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function OfferModal({ show, onHide, onSave, editingAttribute }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Active');

    useEffect(() => {
        if (editingAttribute) {
            setName(editingAttribute.name || '');
            setStatus(editingAttribute.status || 'Active');
        } else {
            setName('');
            setStatus('Active');
        }
    }, [editingAttribute]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const attributeData = { name, status };
        onSave(attributeData);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{editingAttribute ? 'Edit' : 'Add'} Attribute</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default OfferModal;
