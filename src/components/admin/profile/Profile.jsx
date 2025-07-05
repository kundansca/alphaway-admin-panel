import React, { useState } from 'react';
import Layout from "../../../layout/Index";
import PersonalInfoModal from './PersonalInfoModal';
import AddressModal from './AddressModal';
import ChangePasswordModal from './ChangePasswordModal';
import logo from '../../../assets/img/logo/default.jpeg';

const Profile = () => {
  // 🔁 Replace dynamic data fetch with static profile data
  const [profileData, setProfileData] = useState({
    firstName: 'XYZ',
    lastName: 'Doe',
    email: 'xyz@example.com',
    phone: '(+91) 821 2554-5846',
    country: 'India',
    city: 'Indore',
    state: 'Madhya Pradesh',
    postalCode: '452001',
    address: '123 Main St, Indore, MP'
  });

  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Still used in modal
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔁 This would normally be an API call
      // ✅ Simulate success with static data
      setTimeout(() => {
        setIsPersonalInfoModalOpen(false);
        setIsAddressModalOpen(false);
        alert('Profile updated successfully!');
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-header bg-white">
                <div className="d-flex align-items-center ">
                  <img
                    src={logo}
                    alt="Profile"
                    className="rounded-circle me-5"
                    width="100"
                    height="100"
                  />
                  <div>
                    <h2 className="mb-1">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-muted mb-0">{profileData.city}</p>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Personal Info */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Personal Information</h4>
                    <button onClick={() => setIsPersonalInfoModalOpen(true)} className="btn btn-primary">
                      <i className="bi bi-pencil me-2"></i>Edit
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>First Name:</strong> {profileData.firstName}</p>
                      <p><strong>Email:</strong> {profileData.email}</p>
                      <p><strong>Phone:</strong> {profileData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Address</h4>
                    <button onClick={() => setIsAddressModalOpen(true)} className="btn btn-primary">
                      <i className="bi bi-pencil me-2"></i>Edit
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Country:</strong> {profileData.country}</p>
                      <p><strong>City:</strong> {profileData.city}</p>
                      <p><strong>Address:</strong> {profileData.address}</p>
                      <p><strong>Postal Code:</strong> {profileData.postalCode}</p>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Password</h4>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="btn btn-primary">
                      <i className="bi bi-pencil me-2"></i>Change Password
                    </button>
                  </div>
                  <p>••••••••••••••••••••</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PersonalInfoModal
        show={isPersonalInfoModalOpen}
        onHide={() => setIsPersonalInfoModalOpen(false)}
        profileData={profileData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <AddressModal
        show={isAddressModalOpen}
        onHide={() => setIsAddressModalOpen(false)}
        profileData={profileData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <ChangePasswordModal
        show={isPasswordModalOpen}
        onHide={() => setIsPasswordModalOpen(false)}
      />
    </Layout>
  );
};

export default Profile;
