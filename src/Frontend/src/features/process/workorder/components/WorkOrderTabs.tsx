import React from 'react';
import { ClipboardList, History } from 'lucide-react';

export type WorkOrderTab = 'issue' | 'history';

interface WorkOrderTabsProps {
  activeTab: WorkOrderTab;
  onChange: (tab: WorkOrderTab) => void;
}

const tabs: Array<{ id: WorkOrderTab; label: string; icon: React.ReactNode }> = [
  { id: 'issue', label: '작업 발행', icon: <ClipboardList size={15} /> },
  { id: 'history', label: '작업 이력', icon: <History size={15} /> }
];

const WorkOrderTabs: React.FC<WorkOrderTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div
      role="tablist"
      aria-label="작업지시 탭"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '0.75rem',
        marginBottom: '0.5rem'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            title={tab.label}
            style={{
              minWidth: 120,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '20px',
              border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              padding: '0 1.25rem',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15))' 
                : 'rgba(255, 255, 255, 0.03)',
              boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.15)' : 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default WorkOrderTabs;
