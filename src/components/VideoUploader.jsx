import { useState, useRef } from 'react';
import { uploadFile } from '../../lib/supabase';

export default function VideoUploader({ 
  onUpload, 
  bucket = 'project-videos',
  folder = '',
  maxSize = 50 * 1024 * 1024, // 50MB default
  currentVideo = null
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentVideo);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      throw new Error(`Video size must be less than ${maxSize / 1024 / 1024}MB`);
    }
    
    if (!file.type.startsWith('video/')) {
      throw new Error('Only video files are allowed');
    }
    
    return true;
  };

  const handleFile = async (file) => {
    try {
      validateFile(file);
      setUploading(true);
      setProgress(0);
      
      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      const result = await uploadFile(file, bucket, folder);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setPreview(result.url);
      
      if (onUpload) {
        onUpload(result.url);
      }
      
      alert('Video uploaded successfully!');
      
      setTimeout(() => {
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      setProgress(0);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="video-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
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
        onClick={!uploading ? handleButtonClick : undefined}
      >
        {preview ? (
          <div className="preview-container">
            <video 
              src={preview} 
              controls 
              className="preview-video"
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
            <div className="preview-overlay">
              <span>Click or drop to replace</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            {uploading ? (
              <>
                <div className="upload-spinner"></div>
                <p>Uploading video... {progress}%</p>
              </>
            ) : (
              <>
                <div className="upload-icon">🎬</div>
                <p className="upload-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="upload-hint">
                  MP4, WebM up to {formatFileSize(maxSize)}
                </p>
                <p className="upload-warning">
                  ⚠️ Large videos may take several minutes to upload
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      {uploading && progress > 0 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}
    </div>
  );
}