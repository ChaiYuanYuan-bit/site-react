import React from 'react';
// import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from "./redux";
import './index.css'

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
  ,document.getElementById('root'));
reportWebVitals();
