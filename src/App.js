import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

import Page from "./pages/Page";
import Sidebar from "./components/Sidebar";
import Welcome from "./pages/Welcome";
import Register from "./auth/Register";
import Login from "./auth/Login";
import AppHeader from "./Header";
import { Layout } from "antd";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate("/");
    });
    return () => unsub();
  }, [navigate]);
  return (
    <>
        <Layout style={{ height: "100vh" }}>
          <AppHeader />
          <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 24 }}>
              <Routes>
              <Route path="/page/:id" element={<Page />} />
              <Route
                path="*"
                element={<p>Выберите страницу слева или создайте новую</p>}
              />
              </Routes>
            </div>
          </div>
        </Layout>
    </>
  );
}

export default App;
