import React, { useEffect, useState } from 'react';
import {
  Package,
  Users,
  Activity,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../../../api/client';
import styles from './DashboardHome.module.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    items: 0,
    users: 0,
    activities: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 실제 백엔드에서 데이터를 가져오려고 시도합니다.
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
        // 에러 시 기본값 유지 (백엔드 꺼져있을 때 대비)
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: '전체 품목', value: stats.items, icon: <Package size={24} />, color: '#6366f1' },
    { label: '활성 사용자', value: stats.users, icon: <Users size={24} />, color: '#10b981' },
    { label: '오늘의 활동', value: stats.activities, icon: <Activity size={24} />, color: '#f59e0b' },
    { label: '시스템 가동률', value: '99.9%', icon: <Clock size={24} />, color: '#8b5cf6' },
  ];

  const recentActivities = [
    { id: 1, text: '신규 품목 [CPU-I9-13900K] 등록 완료', time: '10분 전', type: 'info' },
    { id: 2, text: '사용자 [admin] 정보 수정', time: '35분 전', type: 'info' },
    { id: 3, text: '품목 [RAM-DDR5-32G] 재고 업데이트', time: '1시간 전', type: 'success' },
    { id: 4, text: '시스템 백업 완료', time: '3시간 전', type: 'system' },
    { id: 5, text: '신규 공정 정의 추가됨', time: '5시간 전', type: 'info' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={`gradient-text ${styles.title}`}>대시보드</h1>
        <p className={styles.subtitle}>실시간 시스템 현황 및 주요 지표를 확인하세요.</p>
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
            {recentActivities.map((act) => (
              <div key={act.id} className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>{act.text}</p>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><PlusCircle size={20} /> 빠른 작업</h2>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.actionButton}>
              <PlusCircle size={18} /> 신규 품목 등록
            </button>
            <button className={styles.actionButton}>
              <FileText size={18} /> 작업 지시 생성
            </button>
            <button className={styles.actionButton}>
              <Users size={18} /> 사용자 관리
            </button>
            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '10px' }}>
              <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                서버 점검 예정: 오늘 오후 11:00 (UTC+9)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;
