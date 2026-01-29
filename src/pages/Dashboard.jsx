// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const menuItems = [
    {
      title: 'Projects',
      description: 'Manage all portfolio projects',
      path: '/admin/projects',
      color: '#4F46E5',
    },
    {
      title: 'Media Library',
      description: 'Manage images and videos',
      path: '/admin/media',
      color: '#7C3AED',
    },
    {
      title: 'Home Page',
      description: 'Edit showreel and featured projects',
      path: '/admin/home-settings',
      color: '#EC4899',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to StyleFrame CMS</p>
      </div>

      <div className="dashboard-grid">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="dashboard-card"
            style={{ '--card-color': item.color }}
          >
            <div className="card-icon">{item.icon}</div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Quick Stats</h3>
          <p>View your content at a glance</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;