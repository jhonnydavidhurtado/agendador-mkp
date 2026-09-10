import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Agendador MKP';

const pages = import.meta.glob('./Pages/**/*.jsx');

createInertiaApp({
title: (title) => `${title} - ${appName}`,


resolve: async (name) => {
    const path = `./Pages/${name}.jsx`;
    const page = pages[path];

    if (!page) {
        throw new Error(
            `No se encontró la página de Inertia: ${path}`
        );
    }

    const module = await page();

    if (!module.default) {
        throw new Error(
            `La página ${path} no tiene un export default.`
        );
    }

    return module.default;
},

setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
},

progress: {
    color: '#2563eb',
},


});
