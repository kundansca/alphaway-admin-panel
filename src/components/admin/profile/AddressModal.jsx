import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddressModal = ({ show, onHide, profileData, handleInputChange, handleSubmit, loading }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Address Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={profileData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="postalCode"
                                value={profileData.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddressModal;