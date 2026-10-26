import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventarisList from './pages/Inventaris/InventarisList';
import OperasionalModule from './pages/OperasionalModule';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import HomepageManager from './pages/HomepageManager';
import MaterialsManager from './pages/MaterialsManager';
import Materials from './pages/Materials';
import PiketQRForm from './pages/PiketQRForm';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AlumniManager from './pages/AlumniManager';
import PiketDocumentSettings from './pages/PiketDocumentSettings';

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/materi" element={<Materials />} />
      <Route path="/form-piket" element={<PiketQRForm />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/kelola-beranda" element={<ProtectedRoute><AdminRoute><HomepageManager /></AdminRoute></ProtectedRoute>} />
      <Route path="/kelola-materi" element={<ProtectedRoute><AdminRoute><MaterialsManager /></AdminRoute></ProtectedRoute>} />
      <Route path="/alumni" element={<ProtectedRoute><AdminRoute><AlumniManager /></AdminRoute></ProtectedRoute>} />
      <Route path="/data-pengurus" element={<ProtectedRoute><AdminRoute><AlumniManager resource="pengurus" /></AdminRoute></ProtectedRoute>} />
      <Route path="/pengaturan-kop-piket" element={<ProtectedRoute><AdminRoute><PiketDocumentSettings /></AdminRoute></ProtectedRoute>} />
      <Route path="/pengaturan-pengurus-piket" element={<Navigate to="/data-pengurus" replace />} />
      <Route path="/pengaturan-dokumen-piket" element={<Navigate to="/data-pengurus" replace />} />
      <Route path="/inventaris" element={<ProtectedRoute><InventarisList /></ProtectedRoute>} />
      <Route path="/unboxing" element={<ProtectedRoute><OperasionalModule type="unboxing" /></ProtectedRoute>} />
      <Route path="/piket" element={<ProtectedRoute><AdminRoute><OperasionalModule type="piket" /></AdminRoute></ProtectedRoute>} />
      <Route path="/sewa" element={<ProtectedRoute><OperasionalModule type="sewa" /></ProtectedRoute>} />
      <Route path="/pengadaan" element={<ProtectedRoute><OperasionalModule type="pengadaan" /></ProtectedRoute>} />
      <Route path="/revitalisasi" element={<ProtectedRoute><OperasionalModule type="revitalisasi" /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
