import React, { useState, useEffect } from 'react';

interface StepCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: { stepName: string; seqNo: number; stepType: string; description: string }) => Promise<void>;
  defaultSeq: number;
}

const StepCreateModal: React.FC<StepCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultSeq
}) => {
  const [form, setForm] = useState({
    stepName: '',
    seqNo: 10,
    stepType: '생산',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        stepName: '',
        seqNo: defaultSeq,
        stepType: '생산',
        description: ''
      });
    }
  }, [isOpen, defaultSeq]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.stepName) {
      alert('공정 단계명은 필수 입력 항목입니다.');
      return;
    }
    await onSubmit(form);
  };

  return (
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
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>공정 단계 신규 등록</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 단계명</label>
            <input
              type="text"
              required
              placeholder="예: 반죽 공정"
              value={form.stepName}
              onChange={(e) => setForm({ ...form, stepName: e.target.value })}
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>정렬 순서 (Seq)</label>
              <input
                type="number"
                required
                placeholder="예: 10"
                value={form.seqNo}
                onChange={(e) => setForm({ ...form, seqNo: Number(e.target.value) })}
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>공정 유형</label>
              <select
                value={form.stepType}
                onChange={(e) => setForm({ ...form, stepType: e.target.value })}
                style={{
                  padding: '0.8rem',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  outline: 'none'
                }}
              >
                <option value="생산" style={{ background: '#1e1e24' }}>생산</option>
                <option value="포장" style={{ background: '#1e1e24' }}>포장</option>
                <option value="검사" style={{ background: '#1e1e24' }}>검사</option>
                <option value="기타" style={{ background: '#1e1e24' }}>기타</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>설명</label>
            <textarea
              placeholder="공정 상세 설명을 입력하세요..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                resize: 'none',
                minHeight: '80px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default StepCreateModal;
