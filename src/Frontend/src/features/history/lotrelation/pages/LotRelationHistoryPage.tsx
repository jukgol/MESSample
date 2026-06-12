import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLotRelationHistory } from '../hooks/useLotRelationHistory';
import LotRelationHistoryHeader from '../components/LotRelationHistoryHeader';
import LotRelationHistorySearchBar from '../components/LotRelationHistorySearchBar';
import LotRelationHistoryTable from '../components/LotRelationHistoryTable';

const LotRelationHistoryPage: React.FC = () => {
  const { relations, loading, error, fetchRelations } = useLotRelationHistory();

  // Search filters
  const [searchParentLot, setSearchParentLot] = useState('');
  const [searchChildLot, setSearchChildLot] = useState('');
  const [searchItemName, setSearchItemName] = useState('');

  const filteredList = useMemo(() => {
    return relations.filter(item => {
      const parentLot = item.parentLotNo || '';
      const childLot = item.childLotNo || '';
      const parentItem = item.parentItemName || '';
      const childItem = item.childItemName || '';

      const matchParent = parentLot.toLowerCase().includes(searchParentLot.toLowerCase());
      const matchChild = childLot.toLowerCase().includes(searchChildLot.toLowerCase());
      const matchItem = parentItem.toLowerCase().includes(searchItemName.toLowerCase()) ||
        childItem.toLowerCase().includes(searchItemName.toLowerCase());

      return matchParent && matchChild && matchItem;
    });
  }, [relations, searchParentLot, searchChildLot, searchItemName]);

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header and Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <LotRelationHistoryHeader />
        <button
          onClick={fetchRelations}
          disabled={loading}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          새로고침
        </button>
      </div>

      {/* Filter Bar */}
      <LotRelationHistorySearchBar
        searchParentLot={searchParentLot}
        setSearchParentLot={setSearchParentLot}
        searchChildLot={searchChildLot}
        setSearchChildLot={setSearchChildLot}
        searchItemName={searchItemName}
        setSearchItemName={setSearchItemName}
      />

      {/* Table Container */}
      <LotRelationHistoryTable
        relations={filteredList}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LotRelationHistoryPage;
