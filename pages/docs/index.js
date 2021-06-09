import React from 'react';
import { RedocStandalone } from 'redoc';
import { getJson } from './doc';

export async function getStaticProps() {
  const spec = getJson();
  return {
    props: {
      spec,
    },
  };
}

export default function index({ spec }) {
  console.log(spec);
  return (
    <div>
      <RedocStandalone specUrl={spec} />
    </div>
  );
}
