// src/admin/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import pages
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import ManageProjects from '../pages/ManageProjects';
import ProjectEdit from '../pages/ProjectEdit';
import MediaLibrary from '../pages/MediaLibrary';
import HomePageSettings from '../pages/HomePageSettings';

// Import layout
import AdminLayout from '../components/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public admin login route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="projects/:slug" element={<ProjectEdit />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="home-settings" element={<HomePageSettings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;