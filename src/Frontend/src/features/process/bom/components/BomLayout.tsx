import React from 'react';

interface BomLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const BomLayout: React.FC<BomLayoutProps> = ({ left, right }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
      gap: '20px',
      alignItems: 'stretch',
      flex: 1
    }}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

export default BomLayout;
