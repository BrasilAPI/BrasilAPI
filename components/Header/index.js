import { FaGithub } from 'react-icons/fa';
import styles from './styles.module.scss';

const REPO_URL = process.env.NEXT_PUBLIC_REPO_URL;
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.containerHeader}>
        <img src="/brasilapi-logo-medium.png" alt="BrasilAPI Logo" />
        <div className={styles.ctas}>
          <a href={REPO_URL}>
            <FaGithub color="#1A2E46" />
          </a>
          <a href={DOCS_URL}>
            <button type="button">Documentação</button>
          </a>
        </div>
      </div>
    </header>
  );
}
