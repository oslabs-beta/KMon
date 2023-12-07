import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';

const main = document.querySelector('#root');

const root = createRoot(main);
root.render(<App />);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './app.jsx';

// const rootElement = document.getElementById('root');

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   rootElement
// );
