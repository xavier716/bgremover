# Background Remover

A free, online tool to remove backgrounds from images automatically. Built with Next.js 14, Tailwind CSS, and @imgly/background-removal.

## Features

- 🎯 **Automatic Background Removal** - AI-powered background removal
- 🔒 **Privacy First** - All processing happens in your browser, no server uploads
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🚀 **Fast** - Uses client-side processing for quick results
- 💾 **Easy Download** - Download processed images instantly
- 🎨 **Modern UI** - Beautiful gradient interface with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Background Removal**: @imgly/background-removal
- **Language**: TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy!

No additional configuration needed - Vercel will automatically detect and configure Next.js.

## How It Works

1. Upload or drag-and-drop an image
2. Click "Remove Background"
3. Wait for AI processing (progress bar shown)
4. Download your background-free image

The background removal uses a machine learning model that runs entirely in your browser using WebAssembly and WebGPU.

## Supported Image Formats

- JPEG/JPG
- PNG
- WebP
- And other common image formats

## Privacy Notice

All image processing happens locally in your browser. Your images are **never** uploaded to any server. The background removal model runs entirely client-side using WebAssembly.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
