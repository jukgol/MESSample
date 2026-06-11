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
    <section style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {masters.map((master) => {
        const isSelected = selectedMasterId === master.processID;

        return (
          <button
            key={master.processID}
            type="button"
            className="workorder-selectable"
            onClick={() => master.processID && onSelectMaster(master.processID)}
            style={{
              minWidth: '260px',
              textAlign: 'left',
              borderRadius: '8px',
              padding: '1rem',
              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              boxShadow: 'none',
              transform: 'none',
              transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <Factory size={17} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{master.processCode}</span>
            </div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{master.processName}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '0.25rem' }}>{master.description || '-'}</div>
          </button>
        );
      })}
    </section>
  );
};

export default WorkOrderMasterList;
