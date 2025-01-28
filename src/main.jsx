import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './Context/ShopContext.jsx';

// Create a root element and render the application
createRoot(document.getElementById('root')).render(
  // Wrap the App component with BrowserRouter and ShopContextProvider
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);