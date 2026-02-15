# Secret Message Extractor

Next.js frontend for extracting secret messages from images.

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

## Run

```bash
npm run dev
```

Frontend runs on port 3000.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., `https://your-backend.onrender.com`)

## Deploy

### Vercel

1. Push to GitHub
2. Import in Vercel dashboard
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy
