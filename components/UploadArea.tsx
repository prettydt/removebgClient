import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { validateFileSize, validateImageFile } from '@/utils/request';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function UploadArea({ onFileSelected, disabled = false }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateAndSelectFile = (file: File) => {
    setError('');

    if (!validateImageFile(file)) {
      setError('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (!validateFileSize(file, 10)) {
      setError('File size must be less than 10MB');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-area-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        <div className="upload-icon">📁</div>
        <p className="upload-text">
          {isDragging ? 'Drop image here' : 'Drag & drop an image here or click to select'}
        </p>
        <p className="upload-hint">Supported formats: JPEG, PNG, WebP (Max 10MB)</p>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
