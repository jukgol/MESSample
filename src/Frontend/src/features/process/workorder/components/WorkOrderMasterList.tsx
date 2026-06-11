import React from 'react';
import { Factory } from 'lucide-react';
import type { ProcessMasterDto } from '../../../../api/data-contracts';

interface WorkOrderMasterListProps {
  masters: ProcessMasterDto[];
  selectedMasterId: number | null;
  onSelectMaster: (id: number) => void;
}

const WorkOrderMasterList: React.FC<WorkOrderMasterListProps> = ({
  masters,
  selectedMasterId,
  onSelectMaster
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      overflowX: 'auto',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingLeft: '0.5rem',
      position: 'relative',
      zIndex: 1,
      width: '100%'
    }}>
      {masters.map((master) => {
        const isSelected = selectedMasterId === master.processID;

        return (
          <button
            key={master.processID}
            type="button"
            className="workorder-selectable"
            onClick={() => master.processID && onSelectMaster(master.processID)}
            style={{
              minWidth: '180px',
              height: '42px',
              textAlign: 'left',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              padding: '0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              border: isSelected ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
              borderBottom: isSelected ? '1px solid #141b27' : '1px solid transparent', // 바디 배경과 연결
              background: isSelected ? '#141b27' : 'rgba(255, 255, 255, 0.02)',
              color: isSelected ? 'white' : 'var(--text-secondary)',
              boxShadow: isSelected ? '0 -4px 12px rgba(0, 0, 0, 0.15)' : 'none',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              position: 'relative',
              bottom: '-1px',
              zIndex: isSelected ? 2 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <Factory size={15} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {master.processName}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default WorkOrderMasterList;
