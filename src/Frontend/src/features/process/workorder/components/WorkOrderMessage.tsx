import React from 'react';

interface WorkOrderMessageProps {
  message: string;
}

const WorkOrderMessage: React.FC<WorkOrderMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
      {message}
    </div>
  );
};

export default WorkOrderMessage;
