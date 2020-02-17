import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>BrasilAPI</title>
        <meta
          name='description'
          content='Vamos transformar o Brasil em uma API?'
        />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap');

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
          justify-content: center;
          align-items: center;
          height: 100%;
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(120deg, #ffffff 0%, #ad7228 100%),
            linear-gradient(120deg, #ffffff00 0%, #0008ff 100%),
            linear-gradient(180deg, #2700ff 0%, #00e7ff 100%),
            linear-gradient(60deg, #10ff00 0%, #38d205 100%),
            radial-gradient(100% 165% at 100% 100%, #3955bd 0%, #000000 100%),
            radial-gradient(100% 150% at 0% 0%, #312f00 0%, #696d28 100%);
          background-blend-mode: overlay, color-dodge, overlay, overlay,
            difference, normal;
          color: #fff;
          font-family: Poppins, sans-serif;
        }

        main {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 1000px;
          padding: 0 20px;
        }

        main > h1 {
          font-size: 90px;
          line-height: 100px;
          color: #fff;
          text-shadow: 0 2px 4px rgba(13, 0, 77, 0.08),
            0 3px 6px rgba(13, 0, 77, 0.08), 0 8px 16px rgba(13, 0, 77, 0.08);
          font-weight: bold;

          @media screen and (max-width: 1000px) {
            font-size: 60px;
            line-height: 70px;
          }

          @media screen and (max-width: 720px) {
            font-size: 50px;
            line-height: 60px;
          }
        }

        main > a {
          color: #232323;
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

      <main>
        <h1>Vamos transformar o brasil em uma api?</h1>
        <a href='https://github.com/filipedeschamps/BrasilAPI'>Saiba mais</a>
      </main>
    </>
  );
}
