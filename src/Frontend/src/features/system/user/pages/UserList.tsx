import React, { useState, useEffect, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserHeader from '../components/UserHeader';
import UserTable from '../components/UserTable';
import UserCreateModal from '../components/UserCreateModal';
import UserUpdateModal from '../components/UserUpdateModal';
import UserDeleteModal from '../components/UserDeleteModal';
import UserActionBar from '../components/UserActionBar';
import UserSearchBar from '../components/UserSearchBar';
import { api } from '../../../../api/client';
import type { UserListDto, RoleDto } from '../../../../api/generated-api';

const UserList: React.FC = () => {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListDto | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserListDto | null>(null);

  // 직책 리스트 로드
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.api.roleList();
        setRoles(response.data || []);
      } catch (err) {
        console.error('직책 리스트 로드 실패:', err);
      }
    };
    fetchRoles();
  }, []);

  // 검색 필터링
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const loginIdMatch = user.loginId?.toLowerCase().includes(searchLower) ?? false;
      const userNameMatch = user.userName?.toLowerCase().includes(searchLower) ?? false;
      const roleNameMatch = (user.roleName || user.roleCode)?.toLowerCase().includes(searchLower) ?? false;
      return loginIdMatch || userNameMatch || roleNameMatch;
    });
  }, [users, searchTerm]);

  return (
    <div style={{ padding: '1rem' }}>
      {/* 1. 헤더 */}
      <UserHeader />

      {/* 2. 프리미엄 카드 내부 레이아웃 */}
      <div className="premium-card" style={{ padding: '2rem' }}>
        
        {/* 액션바 */}
        <UserActionBar
          onRefresh={fetchUsers}
          onOpenCreate={() => setIsCreateOpen(true)}
          loading={loading}
        />

        {/* 검색바 */}
        <UserSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* 테이블 */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          error={error}
          onOpenUpdateModal={(user) => {
            setSelectedUser(user);
            setIsUpdateOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUserForDelete(user);
            setIsDeleteOpen(true);
          }}
        />
      </div>

      {/* 신규 등록 모달 */}
      <UserCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createUser}
        roles={roles}
      />

      {/* 정보 수정 모달 */}
      <UserUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        onSubmit={updateUser}
        roles={roles}
      />

      {/* 계정 삭제 모달 */}
      <UserDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUserForDelete(null);
        }}
        userId={selectedUserForDelete ? Number(selectedUserForDelete.userId) : null}
        loginId={selectedUserForDelete?.loginId || ''}
        onConfirm={deleteUser}
      />
    </div>
  );
};

export default UserList;
