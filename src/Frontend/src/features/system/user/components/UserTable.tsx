import React from 'react';
import type { UserListDto } from '../../../../api/data-contracts';
import { Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface UserTableProps {
  users: UserListDto[];
  loading: boolean;
  error: string | null;
  onOpenUpdateModal: (user: UserListDto) => void;
  onDelete: (user: UserListDto) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  error,
  onOpenUpdateModal,
  onDelete
}) => {
  return (
    <div style={{
      overflowX: 'auto',
      background: 'rgba(30, 41, 59, 0.2)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.3)' }}>
            <th style={{ padding: '1rem' }}>로그인 ID</th>
            <th style={{ padding: '1rem' }}>사용자 이름</th>
            <th style={{ padding: '1rem' }}>배정 직책</th>
            <th style={{ padding: '1rem' }}>계정 상태</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>관리 작업</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#f87171' }}>
                {error}
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                {loading ? '사용자 목록을 불러오는 중...' : '조건에 맞는 사용자가 없습니다.'}
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1rem', fontWeight: 600 }}>{user.loginId}</td>
                <td style={{ padding: '1rem' }}>{user.userName}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    background: user.roleCode === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: user.roleCode === 'ADMIN' ? '#f87171' : 'var(--accent-primary)',
                    border: user.roleCode === 'ADMIN' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)'
                  }}>
                    {user.roleName || user.roleCode}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {user.isActive === 'Y' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={14} /> 활성화
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.85rem' }}>
                      <XCircle size={14} /> 비활성화
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => onOpenUpdateModal(user)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'none',
                        color: 'var(--text-primary)',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit2 size={12} />
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      disabled={user.roleCode === 'ADMIN'}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        boxShadow: 'none',
                        color: '#f87171',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        cursor: user.roleCode === 'ADMIN' ? 'not-allowed' : 'pointer',
                        opacity: user.roleCode === 'ADMIN' ? 0.5 : 1
                      }}
                    >
                      <Trash2 size={12} />
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
