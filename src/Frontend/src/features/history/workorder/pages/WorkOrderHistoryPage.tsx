import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useWorkOrderHistory } from '../hooks/useWorkOrderHistory';
import WorkOrderHistoryHeader from '../components/WorkOrderHistoryHeader';
import WorkOrderHistorySearchBar from '../components/WorkOrderHistorySearchBar';
import WorkOrderHistoryTable from '../components/WorkOrderHistoryTable';

const WorkOrderHistoryPage: React.FC = () => {
  const { historyList, loading, error, fetchHistory } = useWorkOrderHistory();

  // Search filters
  const [searchNo, setSearchNo] = useState('');
  const [searchWorker, setSearchWorker] = useState('');
  const [searchStatus, setSearchStatus] = useState('ALL');

  const filteredList = useMemo(() => {
    return historyList.filter(item => {
      const matchNo = (item.workOrderNo || '').toLowerCase().includes(searchNo.toLowerCase());
      const matchWorker = (item.workerName || '').toLowerCase().includes(searchWorker.toLowerCase());
      const matchStatus = searchStatus === 'ALL' || item.status === searchStatus;
      return matchNo && matchWorker && matchStatus;
    });
  }, [historyList, searchNo, searchWorker, searchStatus]);

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header and Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <WorkOrderHistoryHeader />
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          새로고침
        </button>
      </div>

      {/* Filter Bar */}
      <WorkOrderHistorySearchBar
        searchNo={searchNo}
        setSearchNo={setSearchNo}
        searchWorker={searchWorker}
        setSearchWorker={setSearchWorker}
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
      />

      {/* Table Container */}
      <WorkOrderHistoryTable
        historyList={filteredList}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default WorkOrderHistoryPage;
