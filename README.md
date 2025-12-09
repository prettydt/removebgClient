# Background Removal Client

A Next.js-based web application for removing backgrounds from images. This client provides a user-friendly interface with drag-and-drop support and communicates with a backend service through a secure proxy layer.

## Features

- 🎨 **Drag & Drop Upload**: Easy-to-use interface for uploading images
- 🖼️ **Image Preview**: View original and processed images side by side
- 📥 **Download Results**: Download processed images as transparent PNGs
- 🔒 **Secure API Proxy**: Backend API key is hidden from the client
- ⚠️ **File Validation**: Automatic validation of file types and sizes (max 10MB)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Processing**: Shows loading states during processing

## Technology Stack

- **Next.js 14**: React framework with API routes
- **TypeScript**: Type-safe development
- **Axios**: HTTP client for backend communication
- **React**: UI component library

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- A running backend service that supports the `/remove-bg` endpoint

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd removebgClient
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
BACKEND_URL=http://localhost:8000
API_KEY=your-api-key-here
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | URL of the background removal backend service | `http://localhost:8000` |
| `API_KEY` | API key for authenticating with the backend service | `test123` |

## Usage

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Using the Application

1. **Open the Application**: Navigate to `http://localhost:3000` in your browser
2. **Upload an Image**: 
   - Drag and drop an image onto the upload area, or
   - Click the upload area to select a file from your device
3. **Remove Background**: Click the "Remove Background" button
4. **View Results**: The processed image will appear next to the original
5. **Download**: Click "Download PNG" to save the processed image
6. **Process Another**: Click "Upload Another" to process a new image

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limit

Maximum file size: **10MB**

## Project Structure

```
removebgClient/
├── components/
│   └── UploadArea.tsx          # Drag-and-drop upload component
├── pages/
│   ├── api/
│   │   └── remove-bg.ts        # API proxy route
│   ├── _app.tsx                # Next.js app wrapper
│   └── index.tsx               # Main page
├── public/
│   └── styles.css              # Global styles
├── utils/
│   └── request.ts              # API request utilities
├── .env.example                # Environment variable template
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## API Proxy

The `/api/remove-bg` endpoint acts as a secure proxy between the frontend and backend:

1. **Receives**: Multipart form data with an image from the frontend
2. **Forwards**: The request to the backend with the API key in the `x-api-key` header
3. **Returns**: The processed image as binary data (PNG with transparent background)

This design ensures that the API key is never exposed to the client-side code.

## Development

### Adding New Features

1. **Components**: Add new React components in the `components/` directory
2. **API Routes**: Add new API endpoints in the `pages/api/` directory
3. **Utilities**: Add helper functions in the `utils/` directory
4. **Styles**: Update styles in `public/styles.css`

### Type Safety

The project uses TypeScript for type safety. Make sure to:
- Define proper types for all components and functions
- Avoid using `any` types unless absolutely necessary
- Run `npm run build` to check for type errors

## Troubleshooting

### "Server configuration error"
- Ensure `.env` file exists and contains `BACKEND_URL` and `API_KEY`
- Restart the development server after changing environment variables

### "Failed to remove background"
- Check that the backend service is running and accessible
- Verify the `BACKEND_URL` is correct
- Ensure the backend accepts requests with `x-api-key` header

### File upload fails
- Check file size (must be under 10MB)
- Ensure file format is supported (JPEG, PNG, WebP)
- Check browser console for detailed error messages

## Security Considerations

- API keys are stored server-side only and never exposed to the client
- All requests to the backend go through the proxy layer
- File size validation prevents excessive resource usage
- File type validation ensures only images are processed

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
