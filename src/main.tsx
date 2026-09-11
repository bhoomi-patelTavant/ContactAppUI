import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserRoleProvider } from "./context/UserRole";
import "./i18n";
import { Provider } from 'react-redux';
import { reduxStore, persistor } from './store/reduxStore';
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserRoleProvider>
        <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </UserRoleProvider>
    </BrowserRouter>
  </React.StrictMode>
);