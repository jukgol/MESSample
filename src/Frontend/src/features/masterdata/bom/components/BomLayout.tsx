import React from 'react';

interface BomLayoutProps {
  left: React.ReactNode;
  middle: React.ReactNode;
  right: React.ReactNode;
}

const BomLayout: React.FC<BomLayoutProps> = ({ left, middle, right }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1.5fr 1.2fr',
      gap: '20px',
      alignItems: 'stretch',
      height: 'calc(100vh - 240px)', // BOM 윈도우 한계를 뷰포트에서 직접 제한
      minHeight: 0
    }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{left}</div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{middle}</div>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{right}</div>
    </div>
  );
};

export default BomLayout;
