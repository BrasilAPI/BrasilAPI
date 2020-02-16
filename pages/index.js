export default function Index() {
  return (
    <main>
      <h1>Vamos transformar o brasil em uma api?</h1>
      <a href='https://github.com/filipedeschamps/BrasilAPI'>Saiba mais</a>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap');
        @custom-media --medium (width < 970px);

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
          display: flex;
          align-items: center;
          height: 100%;
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(120deg, #ff00c7 0%, #51003f 100%),
            linear-gradient(120deg, #0030ad 0%, #00071a 100%),
            linear-gradient(180deg, #000346 0%, #ff0000 100%),
            linear-gradient(60deg, #0029ff 0%, #aa0014 100%),
            radial-gradient(100% 165% at 100% 100%, #ff00a8 0%, #00ff47 100%),
            radial-gradient(100% 150% at 0% 0%, #fff500 0%, #51d500 100%);
          background-blend-mode: overlay, color-dodge, overlay, overlay,
            difference, normal;
          color: #fff;
          font-family: Poppins, sans-serif;

          @media (--medium) {
            padding: 0 20px;
          }
        }

        main {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 975px;
        }

        main > h1 {
          font-size: 90px;
          line-height: 100px;
          color: #fff;
          text-shadow: 0 2px 4px rgba(13, 0, 77, 0.08),
            0 3px 6px rgba(13, 0, 77, 0.08), 0 8px 16px rgba(13, 0, 77, 0.08);
          font-weight: bold;

          @media (--medium) {
            font-size: 60px;
            line-height: 70px;
          }
        }

        main > a {
          color: #0d004d;
          cursor: pointer;
          background: #fff;
          line-height: 28px;
          border-radius: 4px;
          padding: 16px 40px;
          width: 200px;
          margin-top: 50px;
          text-align: center;
          text-decoration: none;
        }
      `}</style>
    </main>
  );
}
