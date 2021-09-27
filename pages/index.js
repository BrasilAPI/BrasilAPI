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
            <a
              href="https://brasilapi.com.br/docs"
              className={styles.buttonStartNow}
            >
              Começar agora
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
            <h2>Estatísticas</h2>
            <p>
              Aqui você pode ver os dados de utilização de cada API que
              fornecemos!
            </p>

            <div className={styles.iframeContainer}>
              <iframe
                src="https://p.datadoghq.com/sb/bciualk0rip6udi8-8ca0a926273a610e863a483b09b4cc6f?theme=dark"
                height="550"
                title="Datadog"
              />
            </div>
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
