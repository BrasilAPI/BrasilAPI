import React from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.scss';
import VLibras from '@djpfs/react-vlibras';

function MyApp({ Component, pageProps }) {
  if (typeof Component !== 'function') {
    return null;
  }

  return (
    <>
      <Component {...pageProps} />
      <VLibras />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

MyApp.defaultProps = {
  pageProps: {},
};

export default MyApp;
