import Head from 'next/head';
import { Header } from '../components/Header';

import styles from '../styles/home.module.scss';

export default function Index() {
  return (
    <>
      <Head>
        <title>Brasil API</title>
      </Head>
      <Header />

      <main className={styles.mainContainer}>
        <section className={styles.sectionHeader}>
          <div className={styles.content}>
            <h2>Transformando o Brasil em uma API</h2>
            <p>
              Este projeto experimental tem como objetivo centralizar e
              disponibilizar endpoints modernos com baixíssima latência
              independente de sua fonte.
            </p>
            <a href="https://brasilapi.com.br/docs">
              <button type="button">Começar agora</button>
            </a>
          </div>
          <img
            src="/images/api-schema.svg"
            className={styles.schemaDesk}
            alt="API Schema"
          />
        </section>
        <section className={styles.requests}>
          <div>
            <h2>Requests</h2>
            <p>Esses são alguns dados de requests feitas em nossos endpoints</p>

            <iframe
              src="https://p.datadoghq.com/sb/bciualk0rip6udi8-678e5cdeadeb1ef8027a539d0e2e2adc?from_ts=1620781855460&live=true&theme=dark&to_ts=1620785455460"
              height="550"
              width="920"
              title="Datadog"
            />
          </div>
        </section>

        <section className={styles.motivation}>
          <h2>Motivo</h2>
          <p>
            Acesso programático de informações é algo fundamental na comunicação
            entre sistemas mas, para nossa surpresa, uma informação tão útil e
            pública quanto um CEP não consegue ser acessada diretamente por um
            navegador por conta da API dos Correios não possuir CORS habilitado,
            então o objetivo desse projeto é facilitar a consulta de todos esses
            dados.
          </p>
          <a
            href="https://vercel.com/?utm_source=brasilapi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/powered-by-vercel.svg"
              width="175"
              alt="Powered by Vercel"
            />
          </a>
        </section>
      </main>
    </>
  );
}
