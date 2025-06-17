// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import PartnerNavbar from './Components/PartnerNavbar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import MyOrders from './pages/MyOrders';
import Account from './pages/Account';
import HelpCenter from './pages/HelpCenter';
import PartnerRegister from './pages/PartnerRegister';
import PartnerLogin from './pages/PartnerLogin';
import Checkout from './pages/Checkout';
import ProtectedRoute from './Components/ProtectedRoute';
import PrivateRoute from './Components/PrivateRoute';
import VerifyEmail from './pages/VerifyEmail';
import UploadDocuments from './pages/UploadDocuments';
import PartenrsOrders from './pages/PartenrsOrders';
import PartenrsEarning from './pages/PartnersEarning';
import PartnersHome from './pages/PartnersHome';
import PartnerDashboard from './pages/PartnerDashboard';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PartnerForgotPassword from './pages/PartnerForgotPassword';
import PartnerResetPassword from './pages/PartnerResetPassword';
import PartnerUpdateProfile from "./pages/PartnerUpdateProfile";
import PartnerSupportPage from "./pages/PartnerSupportPage";
import CustomerProfile from './pages/CustomerProfile';
import Contact  from "./pages/Contact";
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import CartBar from "./Components/CartBar";
import MobileStickyNav from './Components/MobileStickyNav';
export default function App() {
  const location = useLocation();

  const isPartnerRoute =
    location.pathname.startsWith('/partner') || location.pathname === '/upload-documents';

  return (
    <div className="flex flex-col min-h-screen">
      {isPartnerRoute ? <PartnerNavbar /> : <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/partner-login" element={<PartnerLogin />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/partner-home" element={<PartnersHome />} />
          <Route path="/partner-earnings" element={<PartenrsEarning />} />
          <Route path="/partner-orders" element={<PartenrsOrders />} />
           <Route path="/blog" element={<Blog />} />
          <Route path="/pricing" element={<Pricing />} />
          //for users
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          //for partners
          <Route path="/reset-password-partner/:token" element={<PartnerResetPassword />} />
          <Route path="/forget-password-partner" element={<PartnerForgotPassword />} />


           <Route path="/partner-update-profile" element={<PartnerUpdateProfile />} />
          <Route path="/partner-Support" element={<PartnerSupportPage />} />
        </Routes>
      </main>

      <CartBar />
      <MobileStickyNav/>
      <Footer />
    </div>
  );
}
