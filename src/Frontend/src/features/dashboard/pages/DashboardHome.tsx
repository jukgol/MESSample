import { useEffect, useState } from 'react';
import {
  Package,
  Users,
  Activity,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import styles from './DashboardHome.module.css';

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const roleCode = user?.roleCode || 'VIEWER';

  const [stats, setStats] = useState({
    items: 0,
    users: 0,
    activities: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      // ADMIN이 아니면 어드민 API 호출을 하지 않고 에러 방지
      if (roleCode !== 'ADMIN') {
        setStats({
          items: 0,
          users: 0,
          activities: 12,
          loading: false
        });
        return;
      }

      try {
        const [itemsRes, usersRes] = await Promise.all([
          api.api.adminTableDataDataList('ITEM'),
          api.api.adminUsersList()
        ]);

        setStats({
          items: itemsRes.data.rows?.length || 0,
          users: usersRes.data.length || 0,
          activities: 24, // 샘플 데이터
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [roleCode]);

  // 권한별 노출 지표 필터링
  const statCards = [
    { label: '전체 품목', value: stats.items, icon: <Package size={24} />, color: '#6366f1', allowedRoles: ['ADMIN'] },
    { label: '활성 사용자', value: stats.users, icon: <Users size={24} />, color: '#10b981', allowedRoles: ['ADMIN'] },
    { label: '오늘의 활동', value: stats.activities, icon: <Activity size={24} />, color: '#f59e0b', allowedRoles: ['ADMIN', 'OPERATOR', 'QC', 'VIEWER'] },
    { label: '시스템 가동률', value: '99.9%', icon: <Clock size={24} />, color: '#8b5cf6', allowedRoles: ['ADMIN', 'OPERATOR', 'QC', 'VIEWER'] },
  ].filter(card => card.allowedRoles.includes(roleCode));

  // 권한별 노출 최근 로그 필터링
  const recentActivities = [
    { id: 1, text: '신규 품목 [CPU-I9-13900K] 등록 완료', time: '10분 전', type: 'info', allowedRoles: ['ADMIN'] },
    { id: 2, text: '사용자 [admin] 정보 수정', time: '35분 전', type: 'info', allowedRoles: ['ADMIN'] },
    { id: 3, text: '품목 [RAM-DDR5-32G] 재고 업데이트', time: '1시간 전', type: 'success', allowedRoles: ['ADMIN'] },
    { id: 4, text: '시스템 백업 완료', time: '3시간 전', type: 'system', allowedRoles: ['ADMIN', 'VIEWER'] },
    { id: 5, text: '신규 공정 정의 추가됨', time: '5시간 전', type: 'info', allowedRoles: ['ADMIN', 'OPERATOR'] },
    { id: 6, text: 'LOT [LOT-2026-001] 품질 검사 합격 판정', time: '6시간 전', type: 'success', allowedRoles: ['ADMIN', 'QC'] },
  ].filter(act => act.allowedRoles.includes(roleCode));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={`gradient-text ${styles.title}`}>대시보드</h1>
        <p className={styles.subtitle}>실시간 시스템 현황 및 주요 지표를 확인하세요. ({user?.roleName || '조회자'})</p>
      </header>

      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.loading ? '...' : card.value}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Activity size={20} /> 최근 활동 로그</h2>
            <button className="text-button"><ArrowUpRight size={16} /> 전체보기</button>
          </div>
          <div className={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className={styles.activityItem}>
                  <div className={styles.activityDot}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>{act.text}</p>
                    <span className={styles.activityTime}>{act.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                표시할 활동 로그가 없습니다.
              </div>
            )}
          </div>
        </section>

        {(roleCode === 'ADMIN' || roleCode === 'OPERATOR') ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><PlusCircle size={20} /> 빠른 작업</h2>
            </div>
            <div className={styles.quickActions}>
              {roleCode === 'ADMIN' && (
                <button className={styles.actionButton}>
                  <PlusCircle size={18} /> 신규 품목 등록
                </button>
              )}
              <button className={styles.actionButton}>
                <FileText size={18} /> 작업 지시 생성
              </button>
              {roleCode === 'ADMIN' && (
                <button className={styles.actionButton}>
                  <Users size={18} /> 사용자 관리
                </button>
              )}
              <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '10px' }}>
                <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                  서버 점검 예정: 오늘 오후 11:00 (UTC+9)
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><AlertCircle size={20} /> 알림 및 공지</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', justifyContent: 'center' }}>
              <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '10px' }}>
                <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
                  서버 점검 예정: 오늘 오후 11:00 (UTC+9)
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', gap: '10px' }}>
                <ShieldCheck size={20} style={{ color: '#6366f1', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: '#6366f1' }}>
                  부여된 권한({roleCode === 'QC' ? '품질검사' : '조회자'})에 맞춤 설정된 화면입니다.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
