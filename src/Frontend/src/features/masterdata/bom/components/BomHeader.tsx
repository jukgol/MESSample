import React from 'react';
import { Settings } from 'lucide-react';

const BomHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={28} className="gradient-text" /> BOM 레시피 관리
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0' }}>
          완제품 및 반제품에 소요되는 원자재와 반제품의 레시피 구성(Bill of Materials)을 설정합니다.
        </p>
      </div>
    </div>
  );
};

export default BomHeader;
