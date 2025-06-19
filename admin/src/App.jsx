import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageOrders from "./pages/ManageOrders";
import ManageProducts from "./pages/ManageProducts";
import AddService from "./pages/AddService";
import ManagePartners from "./pages/ManagePartners";
import Sidebar from "./Components/Sidebar";
import AdminLogin from "./pages/AdminLogin";
import AdminVerifyPartners from "./pages/AdminVerifyPartners";
import PartnerDocuments from "./pages/PartnerDocuments";
import AssignOrder from "./pages/AssignOrder";
import EditService from "./pages/EditService"; // ✅ Correct Import

function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="edit-service/:id" element={<EditService />} /> {/* ✅ Fixed route */}
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="providers" element={<ManagePartners />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="add-service" element={<AddService />} />
                    <Route path="assign-order" element={<AssignOrder />} />
                    <Route path="/admin/register-partners" element={<AdminVerifyPartners />} />
                    <Route path="/admin/partner-documents" element={<PartnerDocuments />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
