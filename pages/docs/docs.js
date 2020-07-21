import React from 'react';
import SwaggerUI from "swagger-ui-react"
import documentation from './doc.json'

export default function index() {
  // Examle json Object for documentation -> https://editor.swagger.io/
  return (
    <div>
      <SwaggerUI spec={documentation} />
    </div>
  )
}
