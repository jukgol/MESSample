import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { useItems } from './useItems';

const ItemList = () => {
  const { items, loading, error, fetchItems } = useItems();

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>품목 리스트</h1>
          <p style={{ color: 'var(--text-secondary)' }}>전체 등록된 품목 마스터 정보를 관리합니다. (백엔드 실시간 연동)</p>
        </div>
        <button
          onClick={fetchItems}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 품목 새로고침
        </button>
      </header>

      <div className="premium-card" style={{ padding: '1.5rem' }}>
        {error ? (
          <div style={{ color: '#ef4444', padding: '1rem', textAlign: 'center' }}>{error}</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="품목명 또는 코드로 검색..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'white'
                  }}
                />
              </div>
              <button style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} /> 필터
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                  데이터를 불러오는 중입니다...
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '1rem' }}>ID</th>
                      <th style={{ padding: '1rem' }}>품목명</th>
                      <th style={{ padding: '1rem' }}>설명(규격)</th>
                      <th style={{ padding: '1rem' }}>구분</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>단위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row">
                          <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>{item.id}</td>
                          <td style={{ padding: '1rem' }}>{item.name}</td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.spec}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '4px 10px',
                              background: 'rgba(99, 102, 241, 0.1)',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              border: '1px solid rgba(99, 102, 241, 0.2)'
                            }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>
                            {item.unit}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
    </div>
  );
};

export default ItemList;


