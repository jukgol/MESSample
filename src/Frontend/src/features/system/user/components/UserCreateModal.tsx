import React, { useState, useEffect } from 'react';
import type { RoleDto } from '../../../../api/generated-api';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  roles: RoleDto[];
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles
}) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [isActive, setIsActive] = useState('Y');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoginId('');
      setPassword('');
      setUserName('');
      setRoleCode(roles.length > 0 ? roles[0].roleCode || '' : '');
      setIsActive('Y');
      setErrorMsg('');
      setSubmitting(false);
    }
  }, [isOpen, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password || !userName || !roleCode) {
      setErrorMsg('모든 필수 항목을 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      LOGIN_ID: loginId,
      PASSWORD: password,
      USER_NAME: userName,
      ROLE_CODE: roleCode,
      IS_ACTIVE: isActive
    };

    const success = await onSubmit(payload);
    setSubmitting(false);

    if (success) {
      onClose();
    } else {
      setErrorMsg('사용자 생성에 실패했습니다. 로그인 ID 중복 여부를 확인하세요.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="premium-card" style={{ width: '420px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          신규 사용자 등록
        </h3>

        {errorMsg && (
          <div style={{ color: '#f87171', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* 로그인 ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>로그인 ID *</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(30,41,59,0.5)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              placeholder="예: operator1"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>비밀번호 *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(30,41,59,0.5)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {/* 이름 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>사용자 이름 *</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(30,41,59,0.5)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              placeholder="예: 홍길동"
              required
            />
          </div>

          {/* 직책 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>직책 권한 *</label>
            <select
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(15,23,42,0.8)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {roles.map(role => (
                <option key={role.roleCode} value={role.roleCode || ''}>
                  {role.roleName} ({role.roleCode})
                </option>
              ))}
            </select>
          </div>

          {/* 활성화 여부 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>계정 상태</label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(15,23,42,0.8)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Y">활성화</option>
              <option value="N">비활성화</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                boxShadow: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '10px'
              }}
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;
