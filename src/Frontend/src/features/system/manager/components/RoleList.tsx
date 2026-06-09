import React from 'react';
import type { RoleDto } from '../../../../api/data-contracts';
import { Shield } from 'lucide-react';

interface RoleListProps {
  roles: RoleDto[];
  selectedRole: RoleDto | null;
  onSelectRole: (role: RoleDto) => void;
  loading: boolean;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  selectedRole,
  onSelectRole,
  loading
}) => {
  return (
    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={18} style={{ color: 'var(--accent-primary)' }} />
        시스템 직책 목록
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {roles.map(role => {
          const isSelected = selectedRole?.roleCode === role.roleCode;
          const isAdmin = role.roleCode === 'ADMIN';

          return (
            <div
              key={role.roleCode}
              onClick={() => !loading && onSelectRole(role)}
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 15px rgba(99, 102, 241, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {role.roleName} ({role.roleCode})
                </span>
                {isAdmin && (
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 600 }}>
                    Bypass
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {role.description || '설명이 없습니다.'}
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                매핑된 권한 수: {isAdmin ? '전체 (Superuser)' : `${role.permissions?.length || 0}개`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleList;
