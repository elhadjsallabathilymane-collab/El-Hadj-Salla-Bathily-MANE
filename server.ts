import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // AI Setup
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

  // In-memory store for local operations
  let producedVideos: any[] = [];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all produced videos
  app.get("/api/videos", (req, res) => {
    res.json(producedVideos);
  });

  // System Check (Local Control)
  app.get("/api/system/check", async (req, res) => {
    const { exec } = await import("child_process");
    exec("yt-dlp --version", (error, stdout) => {
      res.json({
        ytDlp: !error,
        version: stdout ? stdout.trim() : null,
        platform: process.platform,
        arch: process.arch
      });
    });
  });

  // Local Download Simulation
  app.post("/api/video/download-local", async (req, res) => {
    const { url, filename } = req.body;
    // In a real local setup, this would use fs to write to C:/Users/...
    // Here we'll return success to show the command was received
    console.log(`[SATAN] Local download command received for: ${filename}`);
    res.json({ status: "success", message: `Downloading ${filename} to local machine...` });
  });

  // Transcript fetching
  app.get("/api/transcript", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "YouTube URL is required" });
    }
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      const text = transcript.map(item => item.text).join(" ");
      res.json({ text });
    } catch (error: any) {
      console.error("Transcript error:", error);
      res.status(500).json({ error: "Failed to fetch transcript" });
    }
  });

  // HeyGen Proxy
  const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

  app.post("/api/heygen/generate", async (req, res) => {
    if (!HEYGEN_API_KEY) return res.status(500).json({ error: "HeyGen API Key missing" });
    const { topic, video_inputs } = req.body;
    
    try {
      const response = await axios.post("https://api.heygen.com/v2/video/generate", { video_inputs, dimension: { width: 1280, height: 720 } }, {
        headers: {
          "X-Api-Key": HEYGEN_API_KEY,
          "Content-Type": "application/json"
        }
      });

      const videoId = response.data.data.video_id;
      const newVideo = {
        id: videoId,
        topic: topic || "Untitled Video",
        status: 'processing',
        date: new Date().toLocaleDateString(),
        heygen_id: videoId
      };
      
      producedVideos.unshift(newVideo);
      res.json(response.data);
    } catch (error: any) {
      console.error("HeyGen Generate error:", error?.response?.data || error.message);
      res.status(error?.response?.status || 500).json(error?.response?.data || { error: "HeyGen failed" });
    }
  });

  app.get("/api/heygen/status", async (req, res) => {
    const { video_id } = req.query;
    if (!HEYGEN_API_KEY) return res.status(500).json({ error: "HeyGen API Key missing" });
    try {
      const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${video_id}`, {
        headers: { "X-Api-Key": HEYGEN_API_KEY }
      });
      
      const statusData = response.data.data;
      if (statusData.status === 'completed') {
        const video = producedVideos.find(v => v.id === video_id);
        if (video) {
          video.status = 'completed';
          video.video_url = statusData.video_url;
          video.thumbnail = statusData.thumbnail_url;
        }
      } else if (statusData.status === 'failed') {
        const video = producedVideos.find(v => v.id === video_id);
        if (video) video.status = 'failed';
      }

      res.json(response.data);
    } catch (error: any) {
      res.status(error?.response?.status || 500).json(error?.response?.data || { error: "Status check failed" });
    }
  });

  // Gemini TTS (Mocking the logic described in the playbook)
  app.post("/api/tts", async (req, res) => {
    const { text } = req.body;
    try {
      // In a real implementation with @google/genai, we would use the TTS capability if available in the SDK
      // For now, we'll return a simple message or integrate with a known TTS API if provided
      // Since @google/genai TTS is newer, let's assume we use the generative model for some "AI speech" logic
      // and return a placeholder for the actual audio generation if the SDK doesn't expose it directly yet.
      // NOTE: The playbook mentions Gemini 2.5 Flash TTS.
      res.json({ message: "TTS triggered", text });
    } catch (error: any) {
      res.status(500).json({ error: "TTS failed" });
    }
  });

  // AI script rewrite
  app.post("/api/ai/rewrite", async (req, res) => {
    const { transcript, url } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript is required" });
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Read the following transcript from a YouTube video (${url}). 
      Write a new script for a HeyGen video API request. 
      Cover the SAME topics and structure as the reference but in COMPLETELY different words. 
      Tone: Authoritative longevity expert. 
      Length: approximately 15,000 characters. 
      Format: Return ONLY a JSON object with a single "input_text" field.
      Transcript: ${transcript.substring(0, 30000)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean potential markdown blocks
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      res.json(JSON.parse(jsonStr));
    } catch (error: any) {
      console.error("AI Rewrite error:", error);
      res.status(500).json({ error: "AI failed to rewrite script" });
    }
  });

  // Thumbnail Generation
  app.post("/api/thumbnail/generate", async (req, res) => {
    const { prompt, mode } = req.body;
    
    if (mode === 'premium') {
      // Premium mode using Gemini (if supported for images) or a placeholder for now
      // Since standard Gemini models are multimodal input but limited output on images in some regions
      // we'll stick to a robust fallback logic.
      res.json({ url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&nologo=true` });
    } else {
      // Free mode using Pollinations
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&model=flux&nologo=true`;
      res.json({ url: imageUrl });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
