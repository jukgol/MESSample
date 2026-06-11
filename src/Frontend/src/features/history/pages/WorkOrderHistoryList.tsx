import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../../api/client';
import { WorkOrderHistoryDto } from '../../../api/data-contracts';
import { Loader2, RefreshCw, Search, ClipboardList } from 'lucide-react';

const WorkOrderHistoryList: React.FC = () => {
  const [historyList, setHistoryList] = useState<WorkOrderHistoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search filters
  const [searchNo, setSearchNo] = useState('');
  const [searchWorker, setSearchWorker] = useState('');
  const [searchStatus, setSearchStatus] = useState('ALL');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.api.historyWorkOrdersList();
      setHistoryList(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch work order history:', err);
      setError('작업지시 이력을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredList = useMemo(() => {
    return historyList.filter(item => {
      const matchNo = (item.workOrderNo || '').toLowerCase().includes(searchNo.toLowerCase());
      const matchWorker = (item.workerName || '').toLowerCase().includes(searchWorker.toLowerCase());
      const matchStatus = searchStatus === 'ALL' || item.status === searchStatus;
      return matchNo && matchWorker && matchStatus;
    });
  }, [historyList, searchNo, searchWorker, searchStatus]);

  const getStatusBadgeStyle = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'COMPLETED':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', color: '#34d399', text: '완료' };
      case 'RUNNING':
        return { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', text: '진행중' };
      case 'CREATED':
      case 'APPROVED':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', text: '승인됨' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: status || '대기' };
    }
  };

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
            <ClipboardList size={28} /> 작업지시 이력 조회
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            시스템에서 승인 및 진행된 작업지시의 전체 목록과 상태 이력을 조회합니다.
          </p>
        </div>
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
      <div className="premium-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>작업지시 번호</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="작업지시 번호 검색..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>작업자</label>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="작업자명 검색..."
              value={searchWorker}
              onChange={(e) => setSearchWorker(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '150px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>상태</label>
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', background: '#151720', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
          >
            <option value="ALL">전체 상태</option>
            <option value="CREATED">CREATED</option>
            <option value="RUNNING">RUNNING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
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
            작업지시 이력을 불러오는 중입니다...
          </div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: '#151720', zIndex: 1 }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>작업지시 번호</th>
                  <th style={{ padding: '1rem' }}>공정 마스터</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>지시 수량</th>
                  <th style={{ padding: '1rem' }}>작업자</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>상태</th>
                  <th style={{ padding: '1rem' }}>승인 일시</th>
                  <th style={{ padding: '1rem' }}>생성 일시</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    const badge = getStatusBadgeStyle(item.status || '');
                    return (
                      <tr key={item.workOrderID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.workOrderID}</td>
                        <td style={{ padding: '1rem', fontWeight: '500', color: 'white' }}>{item.workOrderNo}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.processMasterName}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>{item.orderQty?.toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>{item.workerName || '-'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            background: badge.bg,
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                            fontWeight: 500,
                            display: 'inline-block'
                          }}>
                            {badge.text}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.approvedAt)}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatDate(item.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      조회된 작업지시 이력이 없습니다.
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

export default WorkOrderHistoryList;
