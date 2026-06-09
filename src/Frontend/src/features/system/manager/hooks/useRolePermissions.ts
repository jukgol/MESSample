import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { RoleDto, PermissionDto } from '../../../../api/data-contracts';

export const useRolePermissions = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesRes, permRes] = await Promise.all([
        api.api.roleList(),
        api.api.permissionList()
      ]);

      setRoles(rolesRes.data || []);
      setPermissions(permRes.data || []);
    } catch (err: any) {
      console.error('직책 및 권한 로드 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRolePermissions = async (roleCode: string, permissionsList: string[]) => {
    try {
      setError(null);
      await api.api.roleUpdate(roleCode, { permissions: permissionsList });
      await fetchRolePermissions();
      return true;
    } catch (err: any) {
      console.error('직책 권한 수정 실패:', err);
      setError(err.response?.data?.message || '권한을 설정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  return {
    roles,
    permissions,
    loading,
    error,
    fetchRolePermissions,
    updateRolePermissions
  };
};
