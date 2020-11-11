import Head from 'next/head';
import Image from 'next/image';

export default function Index() {
  return (
    <>
      <Head>
        <title>Brasil API</title>
      </Head>

      <main>
        <div>
          <a
            className="logo"
            href="https://github.com/filipedeschamps/BrasilAPI"
            rel="noopener noreferrer"
          >
            <Image
              src="/brasilapi-logo-medium.png"
              alt="Acessar repositório do BrasilAPI no Github"
              width="700"
              height="438"
            />
          </a>
        </div>

        <div>
          <a
            href="https://vercel.com/?utm_source=brasilapi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/powered-by-vercel.svg"
              width="175"
              height="100"
              alt="Powered by Vercel"
            />
          </a>
        </div>

        <style jsx global>
          {`
            * {
              box-sizing: border-box;
              margin: 0;
              outline: 0;
              padding: 0;
            }

            html,
            body {
              height: 100%;
            }

            body {
              color: #fff;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
            }

            main > a {
              color: #fff;
              font-size: 2em;
              text-decoration: none;
            }
          `}
        </style>
      </main>
    </>
  );
}
