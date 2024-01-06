import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/defaults';


ReactDOM.render(
  <GoogleOAuthProvider clientId="243900479621-laec3pomtfck4hh336bs5m5f0ftt8tbd.apps.googleusercontent.com">
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
  ,
  document.getElementById('root')
);
