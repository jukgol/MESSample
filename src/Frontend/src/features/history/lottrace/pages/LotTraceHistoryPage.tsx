import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLotTraceHistory } from '../hooks/useLotTraceHistory';
import LotTraceHistoryHeader from '../components/LotTraceHistoryHeader';
import LotTraceHistorySearchBar from '../components/LotTraceHistorySearchBar';
import LotTraceHistoryTable from '../components/LotTraceHistoryTable';

const LotTraceHistoryPage: React.FC = () => {
  const { traceList, loading, error, fetchAllTraces } = useLotTraceHistory();
  const [searchText, setSearchText] = useState<string>('');

  const filteredList = useMemo(() => {
    if (!searchText) return traceList;
    const lower = searchText.toLowerCase();
    return traceList.filter(item => {
      const lotNoMatch = (item.lotNo || '').toLowerCase().includes(lower);
      const itemNameMatch = (item.itemName || '').toLowerCase().includes(lower);
      return lotNoMatch || itemNameMatch;
    });
  }, [traceList, searchText]);

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header and Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <LotTraceHistoryHeader />
        <button
          onClick={fetchAllTraces}
          disabled={loading}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          새로고침
        </button>
      </div>

      {/* Filter Bar */}
      <LotTraceHistorySearchBar
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Table Container */}
      <LotTraceHistoryTable
        traceList={filteredList}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LotTraceHistoryPage;
