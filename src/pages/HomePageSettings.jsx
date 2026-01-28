import { useState, useEffect } from 'react';
import { 
  getFeaturedProjects, 
  setFeaturedProjects, 
  getHomePageSettings,
  updateHomePageSettings,
  getProjects
} from '../../lib/supabaseAdmin';
import VideoUploader from '../components/VideoUploader';
import ImageUploader from '../components/ImageUploader';
import '../admin.css';

export default function HomePageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredProjects, setFeaturedProjectsState] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [showreelVideo, setShowreelVideo] = useState('');
  const [showreelPoster, setShowreelPoster] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load featured projects
      const featured = await getFeaturedProjects();
      setFeaturedProjectsState(featured);

      // Load all available projects
      const all = await getProjects();
      setAvailableProjects(all);

      // Load home page settings
      const settings = await getHomePageSettings();
      setShowreelVideo(settings.showreel_video_url || '');
      setShowreelPoster(settings.showreel_poster_url || '');
      
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load home page settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeaturedProject = (projectId) => {
    const project = availableProjects.find(p => p.id === projectId);
    if (!project) return;

    if (featuredProjects.length >= 8) {
      alert('You can only feature up to 8 projects on the home page');
      return;
    }

    if (featuredProjects.some(fp => fp.project_id === projectId)) {
      alert('This project is already featured');
      return;
    }

    setFeaturedProjectsState(prev => [...prev, {
      project_id: projectId,
      display_order: prev.length,
      projects: project
    }]);
  };

  const handleRemoveFeaturedProject = (projectId) => {
    setFeaturedProjectsState(prev => 
      prev.filter(fp => fp.project_id !== projectId)
        .map((fp, index) => ({ ...fp, display_order: index }))
    );
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedItem === null || draggedItem === index) return;

    const items = [...featuredProjects];
    const draggedItemContent = items[draggedItem];
    
    // Remove dragged item
    items.splice(draggedItem, 1);
    // Insert at new position
    items.splice(index, 0, draggedItemContent);
    
    // Update display order
    const reordered = items.map((item, idx) => ({
      ...item,
      display_order: idx
    }));
    
    setFeaturedProjectsState(reordered);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleShowreelVideoUpload = (url) => {
    setShowreelVideo(url);
  };

  const handleShowreelPosterUpload = (url) => {
    setShowreelPoster(url);
  };

  const handleSave = async () => {
    if (featuredProjects.length !== 8) {
      if (!confirm(`You have ${featuredProjects.length} featured projects. The home page displays exactly 8 projects. Continue saving?`)) {
        return;
      }
    }

    try {
      setSaving(true);

      // Save featured projects
      const projectIds = featuredProjects.map(fp => fp.project_id);
      await setFeaturedProjects(projectIds);

      // Save home page settings
      await updateHomePageSettings({
        showreel_video_url: showreelVideo,
        showreel_poster_url: showreelPoster
      });

      alert('Home page settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  const unselectedProjects = availableProjects.filter(
    p => !featuredProjects.some(fp => fp.project_id === p.id)
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Home Page Settings</h1>
        <button 
          onClick={handleSave} 
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Featured Projects Section */}
      <div className="form-section">
        <h2>Featured Projects (8 slots)</h2>
        <p className="help-text">
          Drag and drop to reorder. These projects will appear on the home page.
        </p>

        <div className="featured-slots">
          {featuredProjects.map((featured, index) => (
            <div
              key={featured.project_id}
              className={`featured-slot ${draggedItem === index ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="featured-slot-number">{index + 1}</div>
              <div className="featured-slot-content">
                {featured.projects.hero_image_url && (
                  <img 
                    src={featured.projects.hero_image_url} 
                    alt={featured.projects.title}
                    className="featured-slot-image"
                  />
                )}
                <div className="featured-slot-info">
                  <div className="featured-slot-title">{featured.projects.title}</div>
                  <div className="featured-slot-client">{featured.projects.client}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFeaturedProject(featured.project_id)}
                className="btn-remove"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {[...Array(8 - featuredProjects.length)].map((_, index) => (
            <div key={`empty-${index}`} className="featured-slot empty">
              <div className="featured-slot-number">
                {featuredProjects.length + index + 1}
              </div>
              <div className="featured-slot-content">
                <div className="empty-slot-text">Empty Slot</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Selector */}
        {featuredProjects.length < 8 && unselectedProjects.length > 0 && (
          <div className="form-group">
            <label>Add Project to Featured</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddFeaturedProject(e.target.value);
                  e.target.value = '';
                }
              }}
              className="project-selector"
            >
              <option value="">Select a project...</option>
              {unselectedProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title} - {project.client} ({project.year})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Showreel Section */}
      <div className="form-section">
        <h2>Showreel</h2>

        <div className="form-group">
          <label>Showreel Video</label>
          <VideoUploader
            onUpload={handleShowreelVideoUpload}
            bucket="hero-videos"
            folder="showreel"
            currentVideo={showreelVideo}
          />
          {showreelVideo && (
            <small>Current: {showreelVideo}</small>
          )}
        </div>

        <div className="form-group">
          <label>Showreel Poster Image</label>
          <ImageUploader
            onUpload={handleShowreelPosterUpload}
            bucket="hero-images"
            folder="showreel"
            currentImage={showreelPoster}
          />
          {showreelPoster && (
            <small>Current: {showreelPoster}</small>
          )}
        </div>
      </div>

      {/* Preview */}
      {showreelVideo && (
        <div className="form-section">
          <h2>Showreel Preview</h2>
          <div className="video-preview">
            <video
              controls
              poster={showreelPoster}
              style={{ width: '100%', maxWidth: '800px' }}
            >
              <source src={showreelVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button 
          onClick={handleSave} 
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}