import React from 'react';
import dynamic from "next/dynamic";

const DynamicSwaggerUI = dynamic(() => import('./docs'), {
    ssr: false,
});

export default function DynamicSwaggerUIDocs() {
    return (
        <DynamicSwaggerUI />
    )
}