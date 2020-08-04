import React from 'react'
import { RedocStandalone } from 'redoc';
import Documentation from './doc.json'

export default function index2() {
  return (
    <div>
      <RedocStandalone
        specUrl={Documentation}
      />
    </div>
  )
}
