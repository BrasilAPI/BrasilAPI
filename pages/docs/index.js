import React from 'react';
import { RedocStandalone } from 'redoc';
import { getJsonDoc } from '../../services/getJsonDoc';

export async function getServerSideProps() {
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
