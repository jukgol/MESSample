import React, { useState, useEffect } from 'react';
import { useRolePermissions } from '../hooks/useRolePermissions';
import RoleHeader from '../components/RoleHeader';
import RoleList from '../components/RoleList';
import PermissionChecklist from '../components/PermissionChecklist';
import type { RoleDto } from '../../../../api/generated-api';

const RoleManager: React.FC = () => {
  const { roles, permissions, loading, error, updateRolePermissions } = useRolePermissions();
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);

  // 역할 목록이 첫 로드되면 첫 번째 역할을 자동 선택
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    } else if (selectedRole) {
      // 갱신된 데이터를 로컬 상태와 동기화
      const refreshed = roles.find(r => r.roleCode === selectedRole.roleCode);
      if (refreshed) {
        setSelectedRole(refreshed);
      }
    }
  }, [roles, selectedRole]);

  return (
    <div className="content-inner" style={{ padding: '1rem' }}>
      {/* 1. 헤더 */}
      <RoleHeader />

      {/* 2. 프리미엄 카드 내부 다단 레이아웃 */}
      <div className="premium-card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* 좌측 직책 목록 */}
          <RoleList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            loading={loading}
          />

          {/* 우측 권한 매핑 체크리스트 */}
          <PermissionChecklist
            selectedRole={selectedRole}
            permissions={permissions}
            onSave={updateRolePermissions}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleManager;
