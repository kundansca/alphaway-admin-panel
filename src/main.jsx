import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
    </Provider>
);
