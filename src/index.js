import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Drawingpage from "./pages/Drawingpage";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import { ClerkProvider } from "@clerk/clerk-react";
export default function App() {

  const navigate = useNavigate();
  return (

      <ClerkProvider
        publishableKey={"pk_test_cG9wdWxhci1qYXliaXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ"}
        navigate={(to) => navigate(to)}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Drawingpage />} />
          {/*<Route path="*" element={<NoPage />} />*/}

        </Routes>
      </ClerkProvider>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </React.StrictMode>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
