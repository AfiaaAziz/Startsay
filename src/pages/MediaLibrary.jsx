// src/pages/MediaLibrary.jsx
import React, { useState, useEffect } from 'react';
import { listFiles, deleteFile, uploadFile } from '../lib/supabaseAdmin';
import { supabase } from '../lib/supabase';
import '../styles/MediaLibrary.css';

const MediaLibrary = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await listFiles('media');
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
      setMessage('Error loading media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const publicUrl = await uploadFile('media', filePath, file);
      
      setMessage('File uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
      await loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      await deleteFile('media', fileName);
      setMessage('File deleted successfully');
      setTimeout(() => setMessage(''), 3000);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage('Error deleting file');
    }
  };

  const getPublicUrl = (fileName) => {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setMessage('URL copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
  };

  const isVideo = (fileName) => {
    return /\.(mp4|webm|mov)$/i.test(fileName);
  };

  if (loading) {
    return <div className="loading">Loading media library...</div>;
  }

  return (
    <div className="media-library">
      <div className="media-header">
        <h1>Media Library</h1>
        <div className="upload-section">
          <label className="btn-primary upload-btn">
            {uploading ? 'Uploading...' : 'Upload File'}
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*"
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="media-grid">
        {files.length === 0 ? (
          <div className="empty-state">
            <p>No files uploaded yet</p>
            <p>Upload images and videos to get started</p>
          </div>
        ) : (
          files.map((file) => {
            const publicUrl = getPublicUrl(file.name);
            
            return (
              <div key={file.name} className="media-item">
                <div className="media-preview">
                  {isImage(file.name) && (
                    <img src={publicUrl} alt={file.name} />
                  )}
                  {isVideo(file.name) && (
                    <video src={publicUrl} />
                  )}
                  {!isImage(file.name) && !isVideo(file.name) && (
                    <div className="file-icon">📄</div>
                  )}
                </div>
                
                <div className="media-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.metadata?.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <div className="media-actions">
                  <button
                    onClick={() => copyToClipboard(publicUrl)}
                    className="btn-secondary btn-small"
                    title="Copy URL"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => window.open(publicUrl, '_blank')}
                    className="btn-secondary btn-small"
                    title="View"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="btn-danger btn-small"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;