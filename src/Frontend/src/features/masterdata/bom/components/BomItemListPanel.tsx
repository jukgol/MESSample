import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Item } from '../../item/hooks/useItems';

interface BomItemListPanelProps {
  items: Item[];
  onAddInput: (itemId: number) => void;
  onAddOutput: (itemId: number) => void;
  hasSelectedRecipe: boolean;
}

const BomItemListPanel: React.FC<BomItemListPanelProps> = ({
  items,
  onAddInput,
  onAddOutput,
  hasSelectedRecipe
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.2rem', minHeight: 0 }}>
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.8rem', color: 'white' }}>전체 품목 목록</h3>
      
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }}
        />
        <input
          type="text"
          placeholder="품목명 또는 코드로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.6rem 0.6rem 2.2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            outline: 'none',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Item List Container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  [{item.category}] {item.itemCode}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                  {item.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                  onClick={() => onAddOutput(Number(item.id))}
                  disabled={!hasSelectedRecipe}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#818cf8',
                    borderRadius: '4px',
                    cursor: hasSelectedRecipe ? 'pointer' : 'not-allowed',
                    opacity: hasSelectedRecipe ? 1 : 0.4
                  }}
                  title="이 품목을 선택된 레시피의 출력물(생산제품)로 추가합니다."
                >
                  출력
                </button>
                <button
                  onClick={() => onAddInput(Number(item.id))}
                  disabled={!hasSelectedRecipe}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    borderRadius: '4px',
                    cursor: hasSelectedRecipe ? 'pointer' : 'not-allowed',
                    opacity: hasSelectedRecipe ? 1 : 0.4
                  }}
                  title="이 품목을 선택된 레시피의 입력물(투입자재)로 추가합니다."
                >
                  입력
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            검색 결과와 일치하는 품목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BomItemListPanel;
