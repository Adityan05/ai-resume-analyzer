# Environment Variables Setup

## Required API Keys

Add these environment variables to your `.env.local` file:

```bash
# DeepSeek API Key (from OpenRouter)
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: App URL for API headers
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Get API Keys

### DeepSeek API Key (via OpenRouter)

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up and create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local`

### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the key and add it to your `.env.local`

## File Structure

```
utils/
├── fileExtraction.js    # PDF/DOCX text extraction
├── resumeParser.js      # Resume text parsing
├── deepseekAPI.js       # DeepSeek API integration
├── geminiAPI.js         # Gemini API integration
└── aggregation.js       # Results aggregation

app/api/analyze/
└── route.js             # Main API endpoint
```

## API Endpoints

- `POST /api/analyze` - Upload and analyze resume
- `GET /api/analyze` - API status check
