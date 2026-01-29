// src/pages/HomePageSettings.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchHomePageSettings,
  updateHomePageSettings,
  fetchFeaturedProjects,
  fetchProjects,
  addFeaturedProject,
  removeFeaturedProject,
  reorderFeaturedProjects,
} from '../lib/supabaseAdmin';
import '../styles/HomePageSettings.css';

const HomePageSettings = () => {
  const [settings, setSettings] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [showreelVideo, setShowreelVideo] = useState('');
  const [showreelPoster, setShowreelPoster] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, featuredData, projectsData] = await Promise.all([
        fetchHomePageSettings(),
        fetchFeaturedProjects(),
        fetchProjects(),
      ]);

      setSettings(settingsData);
      setShowreelVideo(settingsData.showreel_video_url || '');
      setShowreelPoster(settingsData.showreel_poster_url || '');
      setFeaturedProjects(featuredData);
      setAllProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateHomePageSettings({
        showreel_video_url: showreelVideo || null,
        showreel_poster_url: showreelPoster || null,
      });

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeatured = async (projectId) => {
    if (featuredProjects.length >= 8) {
      setMessage('Maximum 8 featured projects allowed');
      return;
    }

    try {
      const newOrder = featuredProjects.length;
      await addFeaturedProject(projectId, newOrder);
      await loadData();
      setMessage('Project added to featured');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding featured project:', error);
      setMessage('Error adding project');
    }
  };

  const handleRemoveFeatured = async (id) => {
    try {
      await removeFeaturedProject(id);
      await loadData();
      setMessage('Project removed from featured');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error removing featured project:', error);
      setMessage('Error removing project');
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    const reordered = [...featuredProjects];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setFeaturedProjects(reordered);

    try {
      await reorderFeaturedProjects(reordered);
      setMessage('Order updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error reordering:', error);
      setMessage('Error updating order');
      await loadData(); // Reload on error
    }
  };

  const availableProjects = allProjects.filter(
    (project) => !featuredProjects.some((fp) => fp.project_id === project.id)
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-settings">
      <div className="settings-header">
        <h1>Home Page Settings</h1>
        <p>Manage showreel and featured projects</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Showreel Section */}
      <section className="settings-section">
        <h2>Showreel Settings</h2>
        <form onSubmit={handleSaveSettings}>
          <div className="form-group">
            <label>Showreel Video URL</label>
            <input
              type="url"
              value={showreelVideo}
              onChange={(e) => setShowreelVideo(e.target.value)}
              placeholder="https://example.com/showreel.mp4"
            />
            <small>Main showreel video displayed on home page</small>
          </div>

          <div className="form-group">
            <label>Showreel Poster Image URL</label>
            <input
              type="url"
              value={showreelPoster}
              onChange={(e) => setShowreelPoster(e.target.value)}
              placeholder="https://example.com/poster.jpg"
            />
            <small>Poster image shown before video loads</small>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </section>

      {/* Featured Projects Section */}
      <section className="settings-section">
        <h2>Featured Projects ({featuredProjects.length}/8)</h2>
        
        {featuredProjects.length > 0 ? (
          <div className="featured-list">
            {featuredProjects.map((fp, index) => (
              <div key={fp.id} className="featured-item">
                <div className="featured-info">
                  <span className="featured-order">#{index + 1}</span>
                  <span className="featured-title">{fp.projects.title}</span>
                  <span className="featured-client">{fp.projects.client}</span>
                </div>
                <div className="featured-actions">
                  {index > 0 && (
                    <button
                      onClick={() => handleReorder(index, index - 1)}
                      className="btn-icon"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {index < featuredProjects.length - 1 && (
                    <button
                      onClick={() => handleReorder(index, index + 1)}
                      className="btn-icon"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveFeatured(fp.id)}
                    className="btn-danger-icon"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No featured projects yet</p>
        )}
      </section>

      {/* Add Featured Project Section */}
      {featuredProjects.length < 8 && availableProjects.length > 0 && (
        <section className="settings-section">
          <h2>Add Featured Project</h2>
          <div className="available-projects">
            {availableProjects.map((project) => (
              <div key={project.id} className="available-item">
                <div className="project-info">
                  <span className="project-title">{project.title}</span>
                  <span className="project-client">{project.client}</span>
                </div>
                <button
                  onClick={() => handleAddFeatured(project.id)}
                  className="btn-secondary"
                >
                  Add to Featured
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePageSettings;