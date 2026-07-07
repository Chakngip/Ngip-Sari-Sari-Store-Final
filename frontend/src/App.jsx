import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/customer/Home.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import OrderHistory from './pages/customer/OrderHistory.jsx';
import OrderDetail from './pages/customer/OrderDetail.jsx';
import Profile from "./pages/customer/Profile";
import Dashboard from './pages/admin/Dashboard.jsx';
import Products from './pages/admin/Products.jsx';
import Cashiers from './pages/admin/Cashiers.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import Inventory from './pages/admin/Inventory.jsx';
import Users from './pages/admin/Users.jsx';
import Settings from './pages/admin/Settings.jsx';
import Reports from './pages/admin/Reports.jsx';
import POS from './pages/cashier/POS.jsx';
import ShiftHistory from './pages/cashier/ShiftHistory.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public / customer storefront */}
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer */}
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={['customer']}><OrderHistory /></ProtectedRoute>
      } />
      <Route path="/orders/:id" element={
        <ProtectedRoute allowedRoles={['customer']}><OrderDetail /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute allowedRoles={['admin']}><Products /></ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute allowedRoles={['admin']}><Inventory /></ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>
      } />
      <Route path="/admin/cashiers" element={
        <ProtectedRoute allowedRoles={['admin']}><Cashiers /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>
      } />

      {/* Cashier */}
      <Route path="/cashier/pos" element={
        <ProtectedRoute allowedRoles={['cashier', 'admin']}><POS /></ProtectedRoute>
      } />
      <Route path="/cashier/shifts" element={
        <ProtectedRoute allowedRoles={['cashier', 'admin']}><ShiftHistory /></ProtectedRoute>
      } />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
