import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';

const main = document.querySelector('#root');

const root = createRoot(main);
root.render(<App />);