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
        alignItems: 'flex-end',
        gap: '0.25rem',
        borderBottom: '1px solid var(--border-color)',
        paddingLeft: '0.25rem'
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
              position: 'relative',
              bottom: -1,
              minWidth: 132,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              border: isActive ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.08)',
              borderBottom: isActive ? '1px solid var(--panel-bg)' : '1px solid var(--border-color)',
              padding: '0 1rem',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--panel-bg)' : 'rgba(255, 255, 255, 0.04)',
              boxShadow: isActive ? '0 -4px 16px rgba(0, 0, 0, 0.12)' : 'none',
              fontWeight: 800,
              transform: 'none',
              zIndex: isActive ? 2 : 1
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
