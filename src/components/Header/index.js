import { FaGithub } from 'react-icons/fa';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.containerHeader}>
        <img
          src="/brasilapi-logo-medium.png"
          className="logoImg"
          alt="BrasilAPI Logo"
        />
        <div className={styles.ctas}>
          <a href="https://github.com/BrasilAPI/BrasilAPI">
            <FaGithub color="#1A2E46" />
          </a>
          <a href="https://brasilapi.com.br/docs">
            <button type="button">Documentação</button>
          </a>
        </div>
      </div>
    </header>
  );
}
