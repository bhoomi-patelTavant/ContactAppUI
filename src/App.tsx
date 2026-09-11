import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => sessionStorage.getItem("isLoggedIn") === "true");
  
  const handleAuthChange = (value: boolean) => {
    sessionStorage.setItem("isLoggedIn", String(value));
    setIsLoggedIn(value);
  };

  return (
    <>
      <CssBaseline />
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => handleAuthChange(false)} />

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login onLogin={() => handleAuthChange(true)} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contacts" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;