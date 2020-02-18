export default function Index() {
  return (
    <main>
      <a href="https://github.com/filipedeschamps/BrasilAPI">Brasil API</a>
      <p>Vamos transformar o Brasil em uma API?</p>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Muli&display=swap");
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
          -webkit-font-smoothing: antialiased;
          align-items: center;
          background: linear-gradient(-90deg, #009c3b, #ffdf00);
          color: #fff;
          display: flex;
          flex-direction: column;
          font: 20px "Muli", sans-serif;
          justify-content: center;
          text-align: center;
        }
        main > a {
          color: #fff;
          font-size: 2em;
          text-decoration: none;
        }

        main > p {
          border-top: 1px solid rgba(999, 999, 999, 0.43);
          margin-top: 10px;
        }
      `}</style>
    </main>
  );
}
