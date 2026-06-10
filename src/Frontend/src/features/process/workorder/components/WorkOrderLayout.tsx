import React from 'react';

interface WorkOrderLayoutProps {
  top: React.ReactNode;
  middle: React.ReactNode;
  bottom: React.ReactNode;
}

const WorkOrderLayout: React.FC<WorkOrderLayoutProps> = ({ top, middle, bottom }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
      {top}
      {middle}
      {bottom}
    </div>
  );
};

export default WorkOrderLayout;
