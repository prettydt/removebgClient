/**
 * Utility functions for making API requests
 */

export async function uploadImageToRemoveBackground(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/remove-bg', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to remove background: ${errorText}`);
  }

  return await response.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  return validTypes.includes(file.type);
}
