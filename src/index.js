import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

const root = ReactDOM.createRoot(document.getElementById('root'));

Kommunicate.init("3a20757aedb73d1c6c770066944a652f7", {
  automaticChatOpenOnNavigation: true,
  popupWidget: true
});



root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


