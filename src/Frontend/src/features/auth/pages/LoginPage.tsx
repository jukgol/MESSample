import { User, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { 
    userId, 
    setUserId, 
    password, 
    setPassword, 
    errorMsg, 
    isLoading, 
    handleLogin 
  } = useLogin();

  return (
    <div className={styles.container}>
      <div className={`premium-card ${styles.card}`}>
        <div className={styles.header}>
          <h1 className={`gradient-text ${styles.title}`}>
            MES TERMINAL
          </h1>
          <p className={styles.subtitle}>
            계정에 로그인하여 시스템을 시작하세요.
          </p>
          {errorMsg && (
            <p className={styles.error}>
              {errorMsg}
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              아이디
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.icon} />
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              비밀번호
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? '로그인 중...' : '로그인'} <ArrowRight size={20} />
          </button>
        </form>

        <div className={styles.footer}>
          <p>도움이 필요하신가요? 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
