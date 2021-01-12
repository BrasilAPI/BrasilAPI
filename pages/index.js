export default function Index() {
  return (
    <main>
      <div>
        <a
          className="logo"
          href="https://github.com/BrasilAPI/BrasilAPI"
          alt="Acessar repositório do BrasilAPI no Github"
        >
          <img src="/brasilapi-logo-medium.png" />
        </a>
      </div>

      <div>
        <a
          href="https://vercel.com/?utm_source=brasilapi"
          target="_blank"
          rel="noopener"
        >
          <img
            src="/powered-by-vercel.svg"
            width="175"
            alt="Powered by Vercel"
          />
        </a>
      </div>

      <style jsx global>{`
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
      `}</style>
    </main>
  );
}
