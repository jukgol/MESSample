import React from 'react';

interface MrpLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const MrpLayout: React.FC<MrpLayoutProps> = ({ left, right }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
      gap: '20px',
      alignItems: 'stretch',
      flex: 1,
      minHeight: 0,
    }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{left}</div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{right}</div>
    </div>
  );
};

export default MrpLayout;
