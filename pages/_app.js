// pages/_app.js
import React from 'react';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
