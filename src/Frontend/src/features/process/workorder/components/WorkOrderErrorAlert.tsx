import React from 'react';

interface WorkOrderErrorAlertProps {
  message: string | null;
}

const WorkOrderErrorAlert: React.FC<WorkOrderErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
      {message}
    </div>
  );
};

export default WorkOrderErrorAlert;
