import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  reorderGallery
} from '../../lib/supabaseAdmin';
import ImageUploader from '../components/ImageUploader';
import VideoUploader from '../components/VideoUploader';
import '../admin.css';

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    year: new Date().getFullYear().toString(),
    category: '',
    description: '',
    hero_image_url: '',
    hero_video_url: '',
    index_video_url: '',
    is_active: true,
    display_order: 0
  });
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (isEdit) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await getProject(id);
      if (project) {
        setFormData({
          title: project.title,
          slug: project.slug,
          client: project.client,
          year: project.year,
          category: project.category || '',
          description: project.description || '',
          hero_image_url: project.hero_image_url || '',
          hero_video_url: project.hero_video_url || '',
          index_video_url: project.index_video_url || '',
          is_active: project.is_active,
          display_order: project.display_order
        });
        
        // Load gallery
        const galleryImages = await getGalleryImages(id);
        setGallery(galleryImages);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title if creating new project
    if (name === 'title' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleHeroImageUpload = (url) => {
    setFormData(prev => ({ ...prev, hero_image_url: url }));
  };

  const handleHeroVideoUpload = (url) => {
    setFormData(prev => ({ ...prev, hero_video_url: url }));
  };

  const handleIndexVideoUpload = (url) => {
    setFormData(prev => ({ ...prev, index_video_url: url }));
  };

  const handleGalleryUpload = async (urls) => {
    if (!isEdit) {
      // If creating new project, store gallery URLs temporarily
      const newGalleryItems = urls.map((url, index) => ({
        image_url: url,
        display_order: gallery.length + index,
        temp_id: Date.now() + index
      }));
      setGallery(prev => [...prev, ...newGalleryItems]);
    } else {
      // If editing, add to database immediately
      try {
        const promises = urls.map((url, index) => 
          addGalleryImage(id, url, gallery.length + index)
        );
        await Promise.all(promises);
        await loadProject(); // Reload to get IDs
      } catch (error) {
        console.error('Error adding gallery images:', error);
        alert('Failed to add gallery images');
      }
    }
  };

  const handleRemoveGalleryImage = async (item) => {
    if (item.id) {
      // Existing image in database
      if (confirm('Remove this image from gallery?')) {
        try {
          await deleteGalleryImage(item.id);
          setGallery(prev => prev.filter(g => g.id !== item.id));
        } catch (error) {
          console.error('Error removing gallery image:', error);
          alert('Failed to remove image');
        }
      }
    } else {
      // Temporary image (not saved yet)
      setGallery(prev => prev.filter(g => g.temp_id !== item.temp_id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.slug || !formData.client || !formData.year) {
      alert('Please fill in all required fields (Title, Slug, Client, Year)');
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        // Update existing project
        await updateProject(id, formData);
        alert('Project updated successfully!');
      } else {
        // Create new project
        const newProject = await createProject(formData);
        
        // Add gallery images if any
        if (gallery.length > 0) {
          const promises = gallery.map((item, index) => 
            addGalleryImage(newProject.id, item.image_url, index)
          );
          await Promise.all(promises);
        }
        
        alert('Project created successfully!');
        navigate(`/admin/projects/${newProject.id}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }

    try {
      await deleteProject(id);
      alert('Project deleted successfully');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
        <div className="header-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
          {isEdit && (
            <button 
              type="button" 
              onClick={handleDelete}
              className="btn-danger"
            >
              Delete Project
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        {/* Basic Info */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug <span className="required">*</span>
                <span className="help-text">URL-friendly name</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                pattern="[a-z0-9-]+"
              />
              <small>Only lowercase letters, numbers, and hyphens</small>
            </div>

            <div className="form-group">
              <label htmlFor="client">
                Client <span className="required">*</span>
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Year <span className="required">*</span>
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                pattern="\d{4}"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Campaign Film, Product Photography"
              />
            </div>

            <div className="form-group">
              <label htmlFor="display_order">Display Order</label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Brief description of the project"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              {' '}Active (visible on site)
            </label>
          </div>
        </div>

        {/* Hero Media */}
        <div className="form-section">
          <h2>Hero Media</h2>
          
          <div className="form-group">
            <label>Hero Image</label>
            <ImageUploader
              onUpload={handleHeroImageUpload}
              bucket="hero-images"
              folder={formData.slug || 'new-project'}
              currentImage={formData.hero_image_url}
            />
            {formData.hero_image_url && (
              <small>Current: {formData.hero_image_url}</small>
            )}
          </div>

          <div className="form-group">
            <label>Hero Video (Optional)</label>
            <VideoUploader
              onUpload={handleHeroVideoUpload}
              bucket="hero-videos"
              folder={formData.slug || 'new-project'}
              currentVideo={formData.hero_video_url}
            />
            {formData.hero_video_url && (
              <small>Current: {formData.hero_video_url}</small>
            )}
          </div>

          <div className="form-group">
            <label>Index Page Video (for hover)</label>
            <VideoUploader
              onUpload={handleIndexVideoUpload}
              bucket="project-videos"
              folder={formData.slug || 'new-project'}
              currentVideo={formData.index_video_url}
            />
            {formData.index_video_url && (
              <small>Current: {formData.index_video_url}</small>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="form-section">
          <h2>Project Gallery</h2>
          
          <div className="form-group">
            <label>Gallery Images</label>
            <ImageUploader
              onUpload={handleGalleryUpload}
              bucket="project-images"
              folder={formData.slug || 'new-project'}
              multiple={true}
            />
          </div>

          {gallery.length > 0 && (
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <div key={item.id || item.temp_id} className="gallery-item">
                  <img src={item.image_url} alt={`Gallery ${index + 1}`} />
                  <div className="gallery-item-overlay">
                    <span>Order: {item.display_order}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(item)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
}