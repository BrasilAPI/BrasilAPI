import Image from 'next/image';
import Link from 'next/link';

import { FaGithub } from 'react-icons/fa';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.containerHeader}>
        <Image
          src="/brasilapi-logo-medium.png"
          alt="BrasilAPI Logo"
          width="182"
          height="45"
        />
        <div className={styles.ctas}>
          <a href="https://github.com/BrasilAPI/BrasilAPI" aria-label="Github">
            <FaGithub color="#1A2E46" />
          </a>
          <a href="#termos-de-uso" className={styles.link}>
            Termos de uso
          </a>
          <Link href="/docs" className={styles.button}>
            Documentação
          </Link>
        </div>
      </div>
    </header>
  );
}
