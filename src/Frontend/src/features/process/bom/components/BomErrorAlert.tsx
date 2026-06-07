import React from 'react';

interface BomErrorAlertProps {
  message: string | null;
}

const BomErrorAlert: React.FC<BomErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
      {message}
    </div>
  );
};

export default BomErrorAlert;
