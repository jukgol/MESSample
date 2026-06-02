import React, { useState, useMemo } from 'react';
import { Search, Database, Loader2 } from 'lucide-react';
import type { Item } from './useItems';

interface BomParentListProps {
  items: Item[];
  loading: boolean;
  selectedItemId: number | null;
  onSelectItem: (id: number) => void;
}

const BomParentList: React.FC<BomParentListProps> = ({
  items,
  loading,
  selectedItemId,
  onSelectItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 품목 필터링 (품목명 또는 ID 또는 타입으로 검색)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower) ?? false;
      const typeMatch = item.category?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = item.id?.toString().includes(searchLower) ?? false;
      return nameMatch || typeMatch || idMatch;
    });
  }, [items, searchTerm]);

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={20} className="gradient-text" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>대상 품목 목록</h2>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
        BOM 레시피를 정의하거나 조회할 대상 부모 품목을 아래 목록에서 선택하세요.
      </p>

      {/* 검색 바 */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="품목명 또는 구분으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem 0.6rem 2.2rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
      </div>

      {/* 품목 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 8px' }} size={24} />
            품목 조회 중...
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const itemIdNum = Number(item.id);
            const isSelected = selectedItemId === itemIdNum;
            
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(itemIdNum)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: isSelected ? 'var(--accent-primary)' : 'white', fontSize: '0.95rem' }}>
                    {item.name}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    background: item.category === '제품' ? 'rgba(16, 185, 129, 0.1)' : item.category === '반제품' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(107, 114, 128, 0.1)', 
                    color: item.category === '제품' ? '#34d399' : item.category === '반제품' ? '#818cf8' : '#9ca3af',
                    borderRadius: '12px',
                    border: `1px solid ${item.category === '제품' ? 'rgba(16, 185, 129, 0.2)' : item.category === '반제품' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`
                  }}>
                    {item.category}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <span>ID: {item.id}</span>
                  <span>단위: {item.unit}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            검색 조건에 맞는 품목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BomParentList;
