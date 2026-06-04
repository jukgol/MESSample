import React from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import type { ItemType } from '../hooks/useItemTypes';

interface ItemTypeTableProps {
  itemTypes: ItemType[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (itemType: ItemType) => void;
  onDelete: (id: number) => void;
}

const ItemTypeTable: React.FC<ItemTypeTableProps> = ({
  itemTypes,
  loading,
  error,
  onOpenUpdateModal,
  onDelete
}) => {
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
                    <th style={{ padding: '1rem' }}>유형명</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {itemTypes.length > 0 ? (
                    itemTypes.map((type) => (
                      <tr key={type.itemTypeID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{type.itemTypeID}</td>
                        <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{type.typeName}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => onOpenUpdateModal(type)}
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
                              onClick={() => onDelete(type.itemTypeID)}
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
                      <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        등록된 품목 유형이 없습니다.
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

export default ItemTypeTable;
