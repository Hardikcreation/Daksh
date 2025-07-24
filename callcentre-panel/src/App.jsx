// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";

import HelpQuery from "./pages/HelpQuery";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  const isAuthenticated = localStorage.getItem("callcentreToken");

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <div className={isAuthenticated ? "ml-64 p-6" : "p-6"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
             
              <Route path="/help-query" element={<HelpQuery />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
