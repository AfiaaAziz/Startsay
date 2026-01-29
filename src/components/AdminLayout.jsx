// src/components/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>STYLEFRAME</h2>
          <p>CMS</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="nav-item">
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/projects" className="nav-item">
            <span>Projects</span>
          </NavLink>

          <NavLink to="/admin/media" className="nav-item">
            <span>Media Library</span>
          </NavLink>

          <NavLink to="/admin/home-settings" className="nav-item">
            <span>Home Page</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;