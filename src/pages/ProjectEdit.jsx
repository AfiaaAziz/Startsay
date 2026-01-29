// src/pages/ProjectEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchProjectBySlug,
  createProject,
  updateProject,
  addGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from '../lib/supabaseAdmin';
import '../styles/ProjectEdit.css';

const ProjectEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Project fields
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    client: '',
    year: new Date().getFullYear().toString(),
    category: '',
    description: '',
    hero_image_url: '',
    hero_video_url: '',
    index_video_url: '',
    is_active: true,
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (!isNew) {
      loadProject();
    }
  }, [slug, isNew]);

  const loadProject = async () => {
    try {
      const data = await fetchProjectBySlug(slug);
      setFormData({
        slug: data.slug,
        title: data.title,
        client: data.client,
        year: data.year,
        category: data.category || '',
        description: data.description || '',
        hero_image_url: data.hero_image_url || '',
        hero_video_url: data.hero_video_url || '',
        index_video_url: data.index_video_url || '',
        is_active: data.is_active,
      });
      setGalleryImages(data.project_gallery || []);
      setProjectId(data.id);
    } catch (error) {
      console.error('Error loading project:', error);
      setMessage('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (isNew) {
        const newProject = await createProject(formData);
        setMessage('Project created successfully!');
        setTimeout(() => {
          navigate(`/admin/projects/${newProject.slug}`);
        }, 1500);
      } else {
        await updateProject(projectId, formData);
        setMessage('Project updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage(error.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGalleryImage = async () => {
    if (!newImageUrl || !projectId) return;

    try {
      const newOrder = galleryImages.length;
      await addGalleryImage(projectId, newImageUrl, newOrder);
      await loadProject();
      setNewImageUrl('');
      setMessage('Image added to gallery');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding image:', error);
      setMessage('Error adding image');
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!confirm('Delete this image from gallery?')) return;

    try {
      await deleteGalleryImage(id);
      await loadProject();
      setMessage('Image deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('Error deleting image');
    }
  };

  const handleReorderGallery = async (fromIndex, toIndex) => {
    const reordered = [...galleryImages];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setGalleryImages(reordered);

    try {
      await reorderGalleryImages(reordered);
      setMessage('Gallery order updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error reordering:', error);
      setMessage('Error updating order');
      await loadProject();
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  return (
    <div className="project-edit">
      <div className="edit-header">
        <h1>{isNew ? 'New Project' : `Edit: ${formData.title}`}</h1>
        <button onClick={() => navigate('/admin/projects')} className="btn-secondary">
          ← Back to Projects
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <section className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens"
            />
            <small>URL-friendly identifier (e.g., "mars-campaign")</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client">Client *</label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Campaign Film, Product Photography"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Project description..."
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <span>Active (visible on public site)</span>
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>Media</h2>

          <div className="form-group">
            <label htmlFor="hero_image_url">Hero Image URL</label>
            <input
              type="url"
              id="hero_image_url"
              name="hero_image_url"
              value={formData.hero_image_url}
              onChange={handleChange}
              placeholder="https://example.com/hero.jpg"
            />
            <small>Main image shown on project detail page</small>
          </div>

          <div className="form-group">
            <label htmlFor="hero_video_url">Hero Video URL</label>
            <input
              type="url"
              id="hero_video_url"
              name="hero_video_url"
              value={formData.hero_video_url}
              onChange={handleChange}
              placeholder="https://example.com/hero-video.mp4"
            />
            <small>Optional hero video (autoplay on project page)</small>
          </div>

          <div className="form-group">
            <label htmlFor="index_video_url">Index Video URL</label>
            <input
              type="url"
              id="index_video_url"
              name="index_video_url"
              value={formData.index_video_url}
              onChange={handleChange}
              placeholder="https://example.com/index-video.mp4"
            />
            <small>Video shown on hover in index/listing pages</small>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Gallery Section - Only for existing projects */}
      {!isNew && projectId && (
        <section className="gallery-section">
          <h2>Gallery Images</h2>

          <div className="add-image">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            <button onClick={handleAddGalleryImage} className="btn-primary">
              Add Image
            </button>
          </div>

          {galleryImages.length > 0 ? (
            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="gallery-item">
                  <img src={image.image_url} alt={`Gallery ${index + 1}`} />
                  <div className="gallery-controls">
                    {index > 0 && (
                      <button
                        onClick={() => handleReorderGallery(index, index - 1)}
                        className="btn-icon"
                      >
                        ←
                      </button>
                    )}
                    <span>#{index + 1}</span>
                    {index < galleryImages.length - 1 && (
                      <button
                        onClick={() => handleReorderGallery(index, index + 1)}
                        className="btn-icon"
                      >
                        →
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGalleryImage(image.id)}
                      className="btn-danger-icon"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-gallery">No gallery images yet</p>
          )}
        </section>
      )}
    </div>
  );
};

export default ProjectEdit;