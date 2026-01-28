import { useState, useRef } from 'react';
import { uploadFile } from '../../lib/supabase';

export default function ImageUploader({ 
  onUpload, 
  bucket = 'project-images',
  folder = '',
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = 'image/*',
  multiple = false,
  currentImage = null
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }
    
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    return true;
  };

  const handleFiles = async (files) => {
    try {
      setUploading(true);
      
      const fileArray = Array.from(files);
      const validFiles = [];
      
      // Validate all files first
      for (const file of fileArray) {
        try {
          validateFile(file);
          validFiles.push(file);
        } catch (error) {
          alert(`${file.name}: ${error.message}`);
        }
      }
      
      if (validFiles.length === 0) {
        setUploading(false);
        return;
      }
      
      // Upload files
      const uploadPromises = validFiles.map(file => 
        uploadFile(file, bucket, folder)
      );
      
      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.url);
      
      // Update preview for single file upload
      if (!multiple && urls.length > 0) {
        setPreview(urls[0]);
      }
      
      // Call parent callback
      if (onUpload) {
        multiple ? onUpload(urls) : onUpload(urls[0]);
      }
      
      alert(`Successfully uploaded ${urls.length} file(s)`);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {preview && !multiple ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <span>Click or drop to replace</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            {uploading ? (
              <>
                <div className="upload-spinner"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p className="upload-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="upload-hint">
                  {accept === 'image/*' ? 'PNG, JPG, AVIF, WebP' : 'Supported files'} 
                  {' '}up to {maxSize / 1024 / 1024}MB
                </p>
                {multiple && (
                  <p className="upload-hint">You can upload multiple files</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}
    </div>
  );
}