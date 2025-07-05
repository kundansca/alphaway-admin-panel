import React from 'react';

const StatusBadge = ({ status }) => {
  const isActive = status === 1;

  return (
    <span className={`badge rounded-pill ${isActive ? 'bg-success' : 'bg-danger'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default StatusBadge;
