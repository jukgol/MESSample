import React, { useState, useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import type { Item } from '../hooks/useItems';
import ItemHeader from '../components/ItemHeader';
import ItemTable from '../components/ItemTable';
import { Search, Loader2, Plus, RotateCw, Database } from 'lucide-react';

const ItemList: React.FC = () => {
  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem, generateDummyItems } = useItems();

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // 등록 폼 입력 상태
  const [createForm, setCreateForm] = useState({
    itemName: '',
    itemType: 'RawMaterial',
    unit: 'EA',
    description: ''
  });

  // 검색어 필터링
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower) ?? false;
      const idMatch = item.id?.toString().toLowerCase().includes(searchLower) ?? false;
      const specMatch = item.spec?.toLowerCase().includes(searchLower) ?? false;
      return nameMatch || idMatch || specMatch;
    });
  }, [items, searchTerm]);

  // 수정 폼 입력 상태
  const [updateForm, setUpdateForm] = useState({
    itemName: '',
    itemType: 'RawMaterial',
    unit: 'EA',
    description: ''
  });

  // 등록 모달 열기 핸들러
  const handleOpenCreate = () => {
    setCreateForm({
      itemName: '',
      itemType: 'RawMaterial',
      unit: 'EA',
      description: ''
    });
    setIsCreateOpen(true);
  };

  // 등록 처리 핸들러
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.itemName) {
      alert('품목명은 필수 입력 항목입니다.');
      return;
    }
    const success = await createItem({
      itemName: createForm.itemName,
      itemType: createForm.itemType,
      unit: createForm.unit,
      description: createForm.description
    });

    if (success) {
      setIsCreateOpen(false);
      alert('품목이 성공적으로 등록되었습니다.');
    }
  };

  // 수정 모달 열기 핸들러
  const handleOpenUpdate = (item: Item) => {
    setSelectedItem(item);
    setUpdateForm({
      itemName: item.name,
      itemType: item.category,
      unit: item.unit,
      description: item.spec === '-' ? '' : item.spec
    });
    setIsUpdateOpen(true);
  };

  // 수정 처리 핸들러
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || selectedItem.id === undefined) return;

    const success = await updateItem(selectedItem.id, {
      itemName: updateForm.itemName,
      itemType: updateForm.itemType,
      unit: updateForm.unit,
      description: updateForm.description
    });

    if (success) {
      setIsUpdateOpen(false);
      alert('품목 정보가 성공적으로 수정되었습니다.');
    }
  };

  // 삭제 처리 핸들러
  const handleDelete = async (id: number | string) => {
    if (window.confirm(`정말로 품목 ID [${id}] 번을 삭제하시겠습니까?\n이 품목과 연계된 LOT가 있는 경우 에러가 발생할 수 있습니다.`)) {
      const success = await deleteItem(id);
      if (success) {
        alert('품목이 삭제되었습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <ItemHeader />

      {/* 1. 버튼 컨테이너 (하나의 컨테이너로 묶고 검색창 위로, 왼쪽 정렬) */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          onClick={async () => {
            const success = await generateDummyItems(10);
            if (success) {
              alert('10개의 테스트 데이터가 성공적으로 생성되었습니다.');
            }
          }}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', boxShadow: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />} 테스트 데이터 10개 생성
        </button>
        <button
          onClick={fetchItems}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', boxShadow: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <RotateCw size={16} />} 새로고침
        </button>
        <button
          onClick={handleOpenCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
        >
          <Plus size={16} /> 품목 신규 등록
        </button>
      </div>

      {/* 2. 검색창 (버튼 아래에 위치, 스크롤 컨테이너 바깥) */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="품목명 또는 코드로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.5rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            color: 'white',
            outline: 'none'
          }}
        />
      </div>

      {/* 3. 테이블 컴포넌트 */}
      <ItemTable
        items={filteredItems}
        loading={loading}
        error={error}
        onOpenUpdateModal={handleOpenUpdate}
        onDelete={handleDelete}
      />

      {/* 1. 신규 등록 모달 */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>품목 신규 등록</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>품목명</label>
                <input
                  type="text"
                  required
                  placeholder="예: PCB Type A"
                  value={createForm.itemName}
                  onChange={(e) => setCreateForm({ ...createForm, itemName: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>구분</label>
                <select
                  value={createForm.itemType}
                  onChange={(e) => setCreateForm({ ...createForm, itemType: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="RawMaterial" style={{ background: '#1e1e24' }}>원자재 (RawMaterial)</option>
                  <option value="Component" style={{ background: '#1e1e24' }}>부품 (Component)</option>
                  <option value="Product" style={{ background: '#1e1e24' }}>제품 (Product)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>단위</label>
                <input
                  type="text"
                  required
                  placeholder="예: EA, KG, M"
                  value={createForm.unit}
                  onChange={(e) => setCreateForm({ ...createForm, unit: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명 (규격)</label>
                <textarea
                  placeholder="품목 설명을 입력하세요..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button type="submit">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 정보 수정 모달 */}
      {isUpdateOpen && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="premium-card" style={{ width: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1e1e24', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>품목 정보 수정</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>품목 ID:</strong> {selectedItem.id}</div>
            </div>
            
            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>품목명</label>
                <input
                  type="text"
                  required
                  placeholder="예: PCB Type A"
                  value={updateForm.itemName}
                  onChange={(e) => setUpdateForm({ ...updateForm, itemName: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>구분</label>
                <select
                  value={updateForm.itemType}
                  onChange={(e) => setUpdateForm({ ...updateForm, itemType: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="RawMaterial" style={{ background: '#1e1e24' }}>원자재 (RawMaterial)</option>
                  <option value="Component" style={{ background: '#1e1e24' }}>부품 (Component)</option>
                  <option value="Product" style={{ background: '#1e1e24' }}>제품 (Product)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>단위</label>
                <input
                  type="text"
                  required
                  placeholder="예: EA, KG, M"
                  value={updateForm.unit}
                  onChange={(e) => setUpdateForm({ ...updateForm, unit: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명 (규격)</label>
                <textarea
                  placeholder="품목 설명을 입력하세요..."
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    boxShadow: 'none'
                  }}
                >
                  취소
                </button>
                <button type="submit">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;


