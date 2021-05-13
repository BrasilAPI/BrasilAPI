import React from 'react';
import { RedocStandalone } from 'redoc';
import Documentation from './doc.json';

export default function index() {
  return (
    <div>
      <RedocStandalone specUrl={Documentation} />
    </div>
  );
}
