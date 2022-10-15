import Head from 'next/head';
import Image from 'next/image';

import { Header } from '../components/Header';

import styles from '../styles/home.module.scss';

export default function Index() {
  return (
    <>
      <Head>
        <title>Brasil API</title>

        <link rel="canonical" href="https://brasilapi.com.br/" />
        <meta
          name="keywords"
          content="Brasil API, cep, ddd, bancos, cnpj, receita federal, ibge, feriados, tabela fipe, municípios, ncm"
        />
        <meta
          name="description"
          content="API gratuita para consultar as mais diversas informações, desde CEP até tabela FIPE!"
        />

        <meta
          property="og:description"
          content="API gratuita para consultar as mais diversas informações, desde CEP até tabela FIPE!"
        />

        <meta property="og:site_name" content="Brasil API" />
        <meta property="og:url" content="https://brasilapi.com.br/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://brasilapi.com.br/favicon-32x32.png"
        />
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
            <a href="/docs" className={styles.buttonStartNow}>
              Começar agora
            </a>
          </div>
          <Image
            src="/images/api-schema.svg"
            className={styles.schemaDesk}
            alt="API Schema"
            width="286"
            height="286"
          />
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
            <Image
              src="/powered-by-vercel.svg"
              width="175"
              height="36"
              alt="Powered by Vercel"
            />
          </a>
        </section>
      </main>
    </>
  );
}
