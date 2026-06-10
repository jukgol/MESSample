import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../../api/client';
import type { UserListDto } from '../../../../api/data-contracts';

export const useUsers = () => {
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.api.adminUsersList();
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('사용자 리스트 조회 실패:', err);
      setError('사용자 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData: any) => {
    try {
      setError(null);      
      await api.api.adminUsersCreate(userData);
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('사용자 생성 실패:', err);
      setError(err.response?.data?.message || '사용자를 생성하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateUser = async (userId: number, userData: any) => {
    try {
      setError(null);
      await api.api.adminUsersUpdate(userId, userData);
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('사용자 수정 실패:', err);
      setError(err.response?.data?.message || '사용자 정보를 수정하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      setError(null);
      await api.api.adminUsersDelete(userId);
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('사용자 삭제 실패:', err);
      setError(err.response?.data?.message || '사용자를 삭제하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
