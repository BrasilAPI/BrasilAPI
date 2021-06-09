import React from 'react';
import { RedocStandalone } from 'redoc';
import { getJsonDoc } from './doc';

export async function getStaticProps() {
  const spec = getJsonDoc();
  return {
    props: {
      spec,
    },
  };
}

export default function index({ spec }) {
  return (
    <div>
      <RedocStandalone specUrl={spec} />
    </div>
  );
}
