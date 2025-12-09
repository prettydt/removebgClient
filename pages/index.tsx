import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import UploadArea from '@/components/UploadArea';
import { uploadImageToRemoveBackground, downloadBlob } from '@/utils/request';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cleanup URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    };
  }, [originalImageUrl, processedImageUrl]);

  const handleFileSelected = (file: File) => {
    // Revoke previous URL before creating new one
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
    }

    setSelectedFile(file);
    setError('');
    setProcessedImageUrl('');
    setProcessedBlob(null);

    // Create preview URL for original image
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    
    // Revoke previous processed image URL if exists
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
      setProcessedImageUrl('');
    }

    try {
      const blob = await uploadImageToRemoveBackground(selectedFile);
      setProcessedBlob(blob);
      
      // Create URL for display
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedBlob) {
      const filename = selectedFile
        ? `${selectedFile.name.replace(/\.[^/.]+$/, '')}_no_bg.png`
        : 'processed_image.png';
      downloadBlob(processedBlob, filename);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalImageUrl('');
    setProcessedImageUrl('');
    setProcessedBlob(null);
    setError('');
    
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
  };

  return (
    <>
      <Head>
        <title>Background Removal Tool</title>
        <meta name="description" content="Remove background from images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <h1 className="title">Background Removal Tool</h1>
        <p className="subtitle">Upload an image to remove its background</p>

        {!selectedFile ? (
          <UploadArea onFileSelected={handleFileSelected} disabled={loading} />
        ) : (
          <div className="content">
            <div className="images-container">
              <div className="image-box">
                <h3>Original Image</h3>
                <img src={originalImageUrl} alt="Original" className="preview-image" />
              </div>

              {processedImageUrl && (
                <div className="image-box">
                  <h3>Processed Image</h3>
                  <div className="transparent-bg">
                    <img src={processedImageUrl} alt="Processed" className="preview-image" />
                  </div>
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              {!processedImageUrl && (
                <button
                  className="btn btn-primary"
                  onClick={handleRemoveBackground}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Remove Background'}
                </button>
              )}

              {processedImageUrl && (
                <>
                  <button className="btn btn-success" onClick={handleDownload}>
                    Download PNG
                  </button>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Upload Another
                  </button>
                </>
              )}

              {!processedImageUrl && (
                <button className="btn btn-secondary" onClick={handleReset} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
