import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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
          content="Brasil API, cep, ddd, bancos, cnpj, receita federal, ibge, feriados, tabela fipe, municípios, ncm, isbn, pix, cvm, cotação dólar, câmbio"
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
            <Link href="/docs" className={styles.buttonStartNow}>
              Começar agora
            </Link>
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
        <section className={styles.terms} id="termos-de-uso">
          <h2>Termos de uso</h2>
          <p>
            O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros,
            por favor,
            <b> não abuse deste serviço</b>
            .
            <br />
            Estamos em beta e ainda elaborando os Termos de Uso, mas por
            enquanto por favor
            <b>
              {' '}
              não utilize formas automatizadas para fazer
              <i> crawling </i>
              ou
              <i> full scan </i>
            </b>
            dos dados da API.
          </p>

          <div className={styles.termsList}>
            <h3>Nunca faça</h3>
            <ul>
              <li>
                Requisições em loop, por exemplo ceps de 00000000 até 99999999
              </li>
            </ul>
          </div>
          <p>
            Um exemplo prático disso foi quando um dos maiores provedores de
            telefonia do Brasil estava validando novamente todos os CEPs (de
            00000000 até 99999999) e ultrapassando em cinco vezes o limite atual
            da nossa conta no servidor. O volume de consultas deve ter a
            natureza de uma pessoa real requisitando um determinado dado. Para
            consultas com um alto volume automatizado forneceremos
            posteriormente alguma solução, como, por exemplo, permitir o
            download de toda a base de CEPs em uma única requisição.
          </p>
        </section>
      </main>
    </>
  );
}
