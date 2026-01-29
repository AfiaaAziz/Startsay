// src/components/ImageUploader.jsx
import React, { useState } from 'react';
import { uploadFile } from '../lib/supabaseAdmin';
import '../styles/ImageUploader.css';

const ImageUploader = ({ onUploadComplete, accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const publicUrl = await uploadFile('media', filePath, file);

      clearInterval(progressInterval);
      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
      setProgress(0);
    }

    e.target.value = '';
  };

  return (
    <div className="image-uploader">
      <label className={`upload-label ${uploading ? 'uploading' : ''}`}>
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          disabled={uploading}
          className="upload-input"
        />
        <div className="upload-content">
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>Uploading... {progress}%</span>
            </div>
          ) : (
            <>
              <span className="upload-icon">⬆️</span>
              <span>Click to upload or drag and drop</span>
            </>
          )}
        </div>
      </label>

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default ImageUploader;