# SATAN COMMAND CENTER - SESSION HANDOFF

## Current Pipeline Status
- **Transcript Engine**: Operational via `youtube-transcript`.
- **AI Rewriter**: Connected to Gemini 2.0 Flash for 15k char script generation.
- **HeyGen Proxy**: Status/Generate endpoints mapped.
- **UI**: Satan CC Dashboard v1 implemented with motion and Tailwind.

## To Do
1. Configure real HeyGen Avatar IDs in Settings.
2. Implement Thumbnail Generator UI (Endpoint is ready).
3. Connect real SpeechRecognition for the "Wake Up Satan" trigger.

## Deployment Note
Built for GitHub deployment. Ensure `HEYGEN_API_KEY` and `GEMINI_API_KEY` are set in the environment.
