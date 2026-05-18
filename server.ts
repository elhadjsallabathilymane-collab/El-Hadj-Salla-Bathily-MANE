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

  // Helper to get GenAI instance
  const getGenAI = (clientApiKey?: string) => {
    const key = clientApiKey || process.env.GEMINI_API_KEY;
    if (!key || key === "") throw new Error("GEMINI_API_KEY manquant. Configurez-le dans les Paramètres.");
    return new GoogleGenAI(key);
  };

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
    console.log(`[SATAN] Local download command received for: ${filename}`);
    res.json({ status: "success", message: `Downloading ${filename} to local machine...` });
  });

  // Transcript fetching
  app.get("/api/transcript", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "L'URL YouTube est requise." });
    }
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      if (!transcript || transcript.length === 0) {
        return res.status(404).json({ error: "Aucun transcript trouvé pour cette vidéo. Assurez-vous que les sous-titres sont activés." });
      }
      const text = transcript.map(item => item.text).join(" ");
      res.json({ text });
    } catch (error: any) {
      console.error("Transcript error:", error);
      res.status(500).json({ error: "Impossible de récupérer les sous-titres de cette vidéo. Essayez-en une autre." });
    }
  });

  // HeyGen Proxy
  app.post("/api/heygen/generate", async (req, res) => {
    const { topic, video_inputs, apiKey: clientApiKey } = req.body;
    const apiKey = clientApiKey || process.env.HEYGEN_API_KEY;
    
    if (!apiKey) return res.status(500).json({ error: "HeyGen API Key missing" });
    
    try {
      const response = await axios.post("https://api.heygen.com/v2/video/generate", { video_inputs, dimension: { width: 1280, height: 720 } }, {
        headers: {
          "X-Api-Key": apiKey,
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
    const { video_id, apiKey: clientApiKey } = req.query;
    const apiKey = clientApiKey as string || process.env.HEYGEN_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "HeyGen API Key missing" });
    try {
      const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${video_id}`, {
        headers: { "X-Api-Key": apiKey }
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

  // Gemini TTS
  app.post("/api/tts", async (req, res) => {
    const { text, apiKey: clientApiKey } = req.body;
    try {
      // Logic would go here
      res.json({ message: "TTS triggered", text });
    } catch (error: any) {
      res.status(500).json({ error: "TTS failed" });
    }
  });

  // AI script rewrite
  app.post("/api/ai/rewrite", async (req, res) => {
    const { transcript, url, apiKey: clientApiKey } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript is required" });
    
    try {
      const genAI = getGenAI(clientApiKey);
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
      
      // Clean potential markdown blocks or extra text
      let jsonStr = text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      try {
        res.json(JSON.parse(jsonStr));
      } catch (parseErr) {
        // Fallback: if not valid JSON, treat the whole thing as the input_text
        res.json({ input_text: text });
      }
    } catch (error: any) {
      console.error("AI Rewrite error:", error);
      res.status(500).json({ error: error.message || "AI failed to rewrite script" });
    }
  });

  // Fetch YouTube Thumbnail URL
  app.get("/api/thumbnail/source", (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: "URL required" });
    
    // Extract video ID
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (!videoIdMatch) return res.status(400).json({ error: "Invalid YouTube URL" });
    
    const videoId = videoIdMatch[1];
    res.json({ 
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId 
    });
  });

  // Thumbnail Generation
  app.post("/api/thumbnail/generate", async (req, res) => {
    const { prompt, mode, sourceUrl, apiKey: clientApiKey } = req.body;
    
    let finalPrompt = prompt || "A high-impact viral YouTube thumbnail";

    if (mode === 'premium' && sourceUrl) {
      try {
        const genAI = getGenAI(clientApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const imageResponse = await axios.get(sourceUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data).toString('base64');

        const analysisPrompt = [
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/jpeg",
            },
          },
          { text: `Analyse cette miniature YouTube.
          Identifie le sujet, le texte affiché (headline) et l'esthétique générale.
          Génère maintenant un prompt de génération d'image en ANGLAIS extrêmement détaillé pour créer une miniature ENTIÈREMENT NOUVELLE et ORIGINALE qui garde l'efficacité virale de celle-ci mais avec des visuels propres.
          Sujet demandé par l'utilisateur: ${prompt || 'Identique à la source mais version originale'}.
          Le prompt doit inclure: 'hyper-realistic', 'sharp focus', 'vivid lighting', 'professional photography'.
          Retourne SEULEMENT le prompt en anglais.` },
        ];

        const result = await model.generateContent(analysisPrompt);
        finalPrompt = (await result.response).text();
      } catch (err) {
        console.error("AI Analysis failed, falling back to basic prompt:", err);
      }
    }
    
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    res.json({ url: imageUrl, usedPrompt: finalPrompt });
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
