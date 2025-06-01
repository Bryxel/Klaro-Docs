# Klaro Docs: Document Analyzer

A Next.js application that analyzes documents using Google's Gemini AI. Upload your PDF documents to get instant feedback, scores, and improvement suggestions.

## Features

- PDF document analysis
- AI-powered feedback using Gemini
- Rate limiting (3 attempts per IP per day)
- Instant scoring and suggestions
- Modern, responsive UI
- Secure file handling

## Tech Stack

- Next.js 15.3.2
- React 19.0.0
- Tailwind CSS
- Google Gemini AI
- PDF Processing

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env` file in the root directory with:

```
GEMINI_API_KEY=your_gemini_api_key
```

## Project Structure

- `app/` - Next.js app directory
  - `api/` - API routes
  - `analyze/` - Analysis page
  - `page.js` - Home page
- `lib/` - Utility functions
  - `gemini.js` - Gemini AI integration
  - `rateLimiter.js` - Rate limiting logic

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

This project is deployed on Vercel. The deployment process is automated through GitHub integration.

## License

MIT License
