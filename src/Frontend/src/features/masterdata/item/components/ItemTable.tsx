import React from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';

interface Item {
  id: string | number;
  itemCode: string;
  name: string;
  spec: string;
  category: string;
  stock: number;
  unit: string;
}

interface ItemTableProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (item: Item) => void;
  onDelete: (id: number | string) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, loading, error, onOpenUpdateModal, onDelete }) => {
  return (
    <div className="premium-card" style={{ padding: '1.5rem' }}>
      {error ? (
        <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
                데이터를 불러오는 중입니다...
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    position: 'sticky',
                    top: 0,
                    background: '#151720',
                    zIndex: 1
                  }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>품목 코드</th>
                    <th style={{ padding: '1rem' }}>품목명</th>
                    <th style={{ padding: '1rem' }}>설명(규격)</th>
                    <th style={{ padding: '1rem' }}>구분</th>
                    <th style={{ padding: '1rem' }}>단위</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.id}</td>
                        <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{item.itemCode}</td>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.spec}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '4px 10px',
                            background: item.category === 'RawMaterial' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            border: `1px solid ${item.category === 'RawMaterial' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
                            color: item.category === 'RawMaterial' ? '#60a5fa' : '#818cf8'
                          }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {item.unit}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => onOpenUpdateModal(item)}
                              style={{
                                padding: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                boxShadow: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="수정"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              style={{
                                padding: '6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '6px',
                                boxShadow: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        등록된 품목이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemTable;
