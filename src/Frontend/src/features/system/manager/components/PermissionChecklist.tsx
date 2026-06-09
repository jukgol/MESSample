import React, { useState, useEffect } from 'react';
import type { RoleDto, PermissionDto } from '../../../../api/data-contracts';
import { Save, Info } from 'lucide-react';

interface PermissionChecklistProps {
  selectedRole: RoleDto | null;
  permissions: PermissionDto[];
  onSave: (roleCode: string, checkedPermissions: string[]) => Promise<boolean>;
  loading: boolean;
}

const PermissionChecklist: React.FC<PermissionChecklistProps> = ({
  selectedRole,
  permissions,
  onSave,
  loading
}) => {
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 역할 변경 시 권한 체크 상태 초기화
  useEffect(() => {
    if (selectedRole) {
      setCheckedPermissions(selectedRole.permissions || []);
      setMessage(null);
    }
  }, [selectedRole]);

  if (!selectedRole) {
    return (
      <div style={{ flex: '2 2 500px', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        좌측에서 직책을 선택하면 권한 매핑 폼이 노출됩니다.
      </div>
    );
  }

  const handlePermissionChange = (code: string, checked: boolean) => {
    if (checked) {
      setCheckedPermissions(prev => [...prev, code]);
    } else {
      setCheckedPermissions(prev => prev.filter(c => c !== code));
    }
  };

  const handleSelectAllCategory = (categoryPrefix: string, selectAll: boolean) => {
    const categoryPermissions = permissions
      .filter(p => p.code?.startsWith(categoryPrefix))
      .map(p => p.code || '');

    if (selectAll) {
      setCheckedPermissions(prev => {
        const otherPermissions = prev.filter(code => !code.startsWith(categoryPrefix));
        return [...otherPermissions, ...categoryPermissions];
      });
    } else {
      setCheckedPermissions(prev => prev.filter(code => !code.startsWith(categoryPrefix)));
    }
  };

  const handleSave = async () => {
    if (!selectedRole.roleCode) return;
    setSaving(true);
    setMessage(null);

    const success = await onSave(selectedRole.roleCode, checkedPermissions);
    if (success) {
      setMessage({ type: 'success', text: '직책 권한 매핑이 실시간으로 갱신되어 캐시에 즉각 적용되었습니다.' });
    } else {
      setMessage({ type: 'error', text: '권한 정보 업데이트에 실패했습니다.' });
    }
    setSaving(false);
  };

  // 권한 카테고리 정의
  const categories = [
    { name: '기준 정보 (Master Data)', prefix: 'Permissions.MasterData' },
    { name: '재고 관리 (Inventory)', prefix: 'Permissions.Inventory' },
    { name: '공정 관리 (Process)', prefix: 'Permissions.Process' },
    { name: '품질 관리 (Quality Control)', prefix: 'Permissions.QC' },
  ];

  const isAdmin = selectedRole.roleCode === 'ADMIN';

  return (
    <div style={{ flex: '2 2 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
            <span className="gradient-text">{selectedRole.roleName}</span> 권한 매핑 설정
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            체크된 기능 권한이 해당 직책 사용자에게 부여됩니다.
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={handleSave}
            disabled={saving || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem'
            }}
          >
            <Save size={16} />
            {saving ? '저장 중...' : '권한 매핑 저장'}
          </button>
        )}
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: message.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
          color: message.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '0.9rem'
        }}>
          {message.text}
        </div>
      )}

      {isAdmin ? (
        <div style={{
          padding: '2rem',
          borderRadius: '16px',
          background: 'rgba(30, 41, 59, 0.3)',
          border: '1px dashed var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Info size={32} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
          <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
            최고 관리자(ADMIN) 직책은 특수 계정입니다.
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
            서버 보안 규칙에 따라 모든 API 요청을 항상 통과(Bypass)하므로, 권한을 별도로 설정할 필요가 없습니다.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {categories.map(cat => {
            const catPerms = permissions.filter(p => p.code?.startsWith(cat.prefix));
            if (catPerms.length === 0) return null;

            const checkedCatCount = catPerms.filter(p => checkedPermissions.includes(p.code || '')).length;
            const isAllChecked = checkedCatCount === catPerms.length;

            return (
              <div
                key={cat.prefix}
                style={{
                  padding: '1.5rem',
                  borderRadius: '20px',
                  background: 'rgba(30, 41, 59, 0.3)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.name}
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={(e) => handleSelectAllCategory(cat.prefix, e.target.checked)}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    그룹 전체 선택
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {catPerms.map(perm => {
                    const isChecked = checkedPermissions.includes(perm.code || '');
                    return (
                      <label
                        key={perm.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          background: isChecked ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                          border: isChecked ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handlePermissionChange(perm.code || '', e.target.checked)}
                          style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {perm.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {perm.code}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PermissionChecklist;
