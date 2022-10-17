import 'bootstrap/dist/css/bootstrap.css';
import '@fontsource/roboto/400.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';

const baseEl = document.getElementsByTagName('base');
const baseUrl = baseEl[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
    <HashRouter basename={baseUrl!}>
        <App />
    </HashRouter>
);
