import { useState } from 'react';
import styles from './styles.module.scss';

import data from './endpoints.json';

export function CardEndpoints() {
  const [selected, setSelected] = useState(0);

  function changeTab(index) {
    setSelected(index);
  }

  return (
    <div className={styles.cardCode}>
      <div className={styles.container}>
        <nav>
          <ul>
            {data.endpoints.map((result) => (
              <li
                key={result.id}
                onClick={() => changeTab(result.id)}
                aria-hidden="true"
                className={selected === result.id ? styles.active : ''}
              >
                {result.title}
              </li>
            ))}
          </ul>
        </nav>
        {data.endpoints.map((result) => (
          <div
            key={result.title}
            className={selected === result.id ? styles.card : styles.invisible}
          >
            <div className={styles.content}>
              <span>
                {result.urlGet}
                <b>{result.flagUrl}</b>
              </span>
              <p>{result.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
