import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../../api/client';
import { LotRelationHistoryDto } from '../../../api/data-contracts';
import { Loader2, RefreshCw, Search, ArrowRight, Layers } from 'lucide-react';

const LotRelationHistoryList: React.FC = () => {
  const [relations, setRelations] = useState<LotRelationHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search filters
  const [searchParentLot, setSearchParentLot] = useState('');
  const [searchChildLot, setSearchChildLot] = useState('');
  const [searchItemName, setSearchItemName] = useState('');

  const fetchRelations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.api.historyLotRelationsList();
      setRelations(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch lot relations:', err);
      setError('LOT 관계 이력을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);

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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('ko-KR');
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={28} /> LOT 관계 이력 조회
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            원자재 투입 및 완제품/반제품 생산 과정에서 생성된 LOT 간의 부모-자식 관계 정보를 조회합니다.
          </p>
        </div>
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
      <div className="premium-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>부모 LOT 번호</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="부모 LOT 번호..."
              value={searchParentLot}
              onChange={(e) => setSearchParentLot(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>자식 LOT 번호</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="자식 LOT 번호..."
              value={searchChildLot}
              onChange={(e) => setSearchChildLot(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>품목명</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="품목명 검색..."
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="premium-card" style={{ padding: '1.5rem' }}>
        {error ? (
          <div style={{ color: '#ef4444', padding: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
            LOT 관계 이력을 불러오는 중입니다...
          </div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                  <th style={{ padding: '1rem' }}>관계 ID</th>
                  <th style={{ padding: '1rem' }}>부모 LOT (품목)</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>관계 흐름</th>
                  <th style={{ padding: '1rem' }}>자식 LOT (품목)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>투입 / 산출 수량</th>
                  <th style={{ padding: '1rem' }}>연관 작업지시</th>
                  <th style={{ padding: '1rem' }}>공정 단계</th>
                  <th style={{ padding: '1rem' }}>생성 일시</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    const isInput = item.relationType === 'Input';
                    return (
                      <tr key={item.lotRelationID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.lotRelationID}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '500', color: '#60a5fa' }}>{item.parentLotNo || '입고/출처없음'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.parentItemName || '-'}</div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <span style={{
                              padding: '2px 8px',
                              background: isInput ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              border: `1px solid ${isInput ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                              color: isInput ? '#f87171' : '#34d399',
                              fontWeight: 500
                            }}>
                              {item.relationType === 'Input' ? '투입' : '산출'}
                            </span>
                            <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '500', color: '#10b981' }}>{item.childLotNo}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.childItemName}</div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ fontWeight: '500', color: 'white' }}>
                            {item.relationType === 'Input' ? `투입: ${item.inputQty || 0}` : `산출: ${item.outputQty}`}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{item.workOrderNo || '-'}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.stepName || '-'}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      조회된 LOT 관계 이력이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotRelationHistoryList;
