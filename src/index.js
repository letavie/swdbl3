import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './Components/Contexts/AuthContext';
import WebSocketProvider from './Components/Contexts/SockContext';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
const root = ReactDOM.createRoot(document.getElementById('root'));
console.error = () => { };
root.render(

  <ErrorBoundary>
    <BrowserRouter>
      <WebSocketProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </WebSocketProvider>
    </BrowserRouter>
  </ErrorBoundary>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
