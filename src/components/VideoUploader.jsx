// src/components/VideoUploader.jsx
import React, { useState } from 'react';
import { uploadFile } from '../lib/supabaseAdmin';
import '../styles/VedioUploader.css';

const VideoUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate progress for large files
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 95));
      }, 200);

      const publicUrl = await uploadFile('media', filePath, file);

      clearInterval(progressInterval);
      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
      setProgress(0);
    }

    e.target.value = '';
  };

  return (
    <div className="video-uploader">
      <label className={`upload-label ${uploading ? 'uploading' : ''}`}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
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
              <span>Uploading video... {progress}%</span>
              <small>This may take a while for large files</small>
            </div>
          ) : (
            <>
              <span className="upload-icon">🎬</span>
              <span>Click to upload video</span>
              <small>Max 100MB • MP4, WebM, MOV</small>
            </>
          )}
        </div>
      </label>

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default VideoUploader;
