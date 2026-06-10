import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ProcessMonitoringErrorAlertProps {
  message: string | null;
}

const ProcessMonitoringErrorAlert: React.FC<ProcessMonitoringErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(239, 68, 68, 0.12)',
        color: '#fecaca',
        borderRadius: '8px',
        padding: '0.85rem 1rem'
      }}
    >
      <AlertTriangle size={18} />
      <span>{message}</span>
    </div>
  );
};

export default ProcessMonitoringErrorAlert;
