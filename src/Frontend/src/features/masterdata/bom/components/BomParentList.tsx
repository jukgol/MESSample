import React, { useState, useMemo } from 'react';
import { Search, Database, Loader2, Trash2 } from 'lucide-react';
import type { BomRecipe } from '../hooks/useBoms';

interface BomParentListProps {
  recipes: BomRecipe[];
  loading: boolean;
  selectedRecipeId: number | null;
  onSelectRecipe: (id: number) => void;
  onDeleteRecipe?: (id: number) => void;
}

const BomParentList: React.FC<BomParentListProps> = ({
  recipes,
  loading,
  selectedRecipeId,
  onSelectRecipe,
  onDeleteRecipe
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 레시피 필터링 (레시피명 또는 코드 또는 공정명으로 검색)
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = recipe.recipeName?.toLowerCase().includes(searchLower) ?? false;
      const codeMatch = recipe.recipeCode?.toLowerCase().includes(searchLower) ?? false;
      const stepMatch = recipe.processStepName?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = recipe.bomRecipeID?.toString().includes(searchLower) ?? false;
      return nameMatch || codeMatch || stepMatch || idMatch;
    });
  }, [recipes, searchTerm]);

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={20} className="gradient-text" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>BOM 레시피 목록</h2>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
        조회하거나 정의할 대상 BOM 레시피를 아래 목록에서 선택하세요.
      </p>

      {/* 검색 바 */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="레시피명 또는 코드로 검색..."
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

      {/* 레시피 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 8px' }} size={24} />
            레시피 조회 중...
          </div>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => {
            const recipeIdNum = Number(recipe.bomRecipeID);
            const isSelected = selectedRecipeId === recipeIdNum;

            return (
              <div
                key={recipe.bomRecipeID}
                onClick={() => onSelectRecipe(recipeIdNum)}
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
                    {recipe.recipeName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#818cf8',
                      borderRadius: '12px',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                      {recipe.recipeCode}
                    </span>
                    {onDeleteRecipe && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('이 레시피를 완전히 삭제하시겠습니까?')) {
                            onDeleteRecipe(recipeIdNum);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(239, 68, 68, 0.6)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <span>ID: {recipe.bomRecipeID}</span>
                  {recipe.processStepName && (
                    <span>공정: {recipe.processStepName}</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            검색 조건에 맞는 레시피가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BomParentList;
