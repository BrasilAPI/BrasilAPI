// pages/_app.js
import React from 'react';
import '../styles/globals.scss';
import VLibras from '@djpfs/react-vlibras';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <VLibras />
    </>
  );
}

export default MyApp;
