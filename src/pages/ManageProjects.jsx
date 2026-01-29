// src/pages/ManageProjects.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject, reorderProjects } from '../lib/supabaseAdmin';
import '../styles/ManageProjects.css';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      setMessage('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete project "${title}"? This will also delete all gallery images.`)) {
      return;
    }

    try {
      await deleteProject(id);
      setMessage('Project deleted successfully');
      setTimeout(() => setMessage(''), 3000);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage('Error deleting project');
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    const reordered = [...projects];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setProjects(reordered);

    try {
      await reorderProjects(reordered);
      setMessage('Order updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error reordering:', error);
      setMessage('Error updating order');
      await loadProjects(); // Reload on error
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="manage-projects">
      <div className="projects-header">
        <h1>Manage Projects</h1>
        <Link to="/admin/projects/new" className="btn-primary">
          + New Project
        </Link>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet</p>
          <Link to="/admin/projects/new" className="btn-primary">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="projects-table">
          <div className="table-header">
            <span className="col-order">Order</span>
            <span className="col-title">Title</span>
            <span className="col-client">Client</span>
            <span className="col-year">Year</span>
            <span className="col-status">Status</span>
            <span className="col-actions">Actions</span>
          </div>

          {projects.map((project, index) => (
            <div key={project.id} className="table-row">
              <div className="col-order">
                <div className="reorder-controls">
                  {index > 0 && (
                    <button
                      onClick={() => handleReorder(index, index - 1)}
                      className="btn-icon"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  <span className="order-number">#{index + 1}</span>
                  {index < projects.length - 1 && (
                    <button
                      onClick={() => handleReorder(index, index + 1)}
                      className="btn-icon"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                </div>
              </div>

              <div className="col-title">
                <Link to={`/admin/projects/${project.slug}`} className="project-link">
                  {project.title}
                </Link>
              </div>

              <div className="col-client">{project.client}</div>
              
              <div className="col-year">{project.year}</div>

              <div className="col-status">
                <span className={`status-badge ${project.is_active ? 'active' : 'inactive'}`}>
                  {project.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="col-actions">
                <Link
                  to={`/admin/projects/${project.slug}`}
                  className="btn-secondary btn-small"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProjects;