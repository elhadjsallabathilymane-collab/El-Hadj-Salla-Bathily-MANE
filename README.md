# Satan Command Center - Local Automation

Welcome to the Satan Command Center. This application is designed to run locally on your machine to automate YouTube content production.

## Prerequisites

1. **Node.js**: Install Node.js v20 or higher.
2. **API Keys**:
   - `GEMINI_API_KEY`: Get one from [Google AI Studio](https://aistudio.google.com/apikey).
   - `HEYGEN_API_KEY`: Required for video generation.
3. **Local Tools** (Optional for advanced features):
   - `yt-dlp`: For robust transcript extraction if the built-in package fails.

## Setup Instructions

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_google_key"
   HEYGEN_API_KEY="your_heygen_key"
   NODE_ENV="development"
   ```

3. **Start the Command Center**:
   ```bash
   npm run dev
   ```

4. **Access UI**:
   Open `http://localhost:3000` in your browser.

## Features

- **Video Factory**: Paste a YouTube URL. Satan will fetch the transcript, rewrite it using AI into a 15k-character script, and submit it to HeyGen.
- **Library**: Monitor render status. Once complete, videos can be downloaded directly to your local computer.
- **Voice Control**: Command Satan using your voice (Wake word: "Wake Up Satan").

## GitHub Deployment

To deploy to GitHub:
1. Connect your repository.
2. Add your secrets (`GEMINI_API_KEY`, `HEYGEN_API_KEY`) to GitHub Action secrets.
3. Use the included `package.json` build scripts for deployment.

---

*“The world’s first truly automated faceless channel engine.”*
