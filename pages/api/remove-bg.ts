import type { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = process.env.BACKEND_URL;
  const apiKey = process.env.API_KEY;

  if (!backendUrl || !apiKey) {
    console.error('Missing environment variables: BACKEND_URL or API_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Parse the multipart form data
    const chunks: Buffer[] = [];
    
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve());
      req.on('error', reject);
    });

    const buffer = Buffer.concat(chunks);
    
    // Extract boundary from content-type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Forward the request to the backend
    const response = await axios.post(`${backendUrl}/remove-bg`, buffer, {
      headers: {
        'Content-Type': contentType,
        'x-api-key': apiKey,
      },
      responseType: 'arraybuffer',
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    // Set the response headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/png');
    
    // Send the binary data
    res.status(200).send(response.data);
  } catch (error: any) {
    console.error('Error forwarding request to backend:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.message || 'Backend service error',
      });
    }
    
    return res.status(500).json({ error: 'Failed to process image' });
  }
}
