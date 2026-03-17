/**
 * routes/avatars.js
 *
 * Avatar generation using Hugging Face Inference API — FREE tier.
 *
 * ─── MODEL USED ──────────────────────────────────────────────────────────────
 *
 *  PRIMARY   timbrooks/instruct-pix2pix  (HF Inference API — free with token)
 *    Takes the uploaded photo + a text instruction and returns a transformed
 *    image. We send 4 instructions (one per pose) to produce aged versions
 *    of the person in different expressions.
 *    .env:  HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx
 *
 *  FALLBACK  The original uploaded photo is copied as a stand-in for every
 *    pose so the rest of the app works end-to-end even without a token.
 *
 * ─── POSE INSTRUCTIONS ───────────────────────────────────────────────────────
 *  shocked:  make this person look 60 years old with wide shocked eyes
 *  talking:  make this person look 60 years old, mouth slightly open, speaking
 *  thinking: make this person look 60 years old, thoughtful expression
 *  smiling:  make this person look 60 years old with a warm genuine smile
 */

const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const axios   = require('axios');
const { v4: uuidv4 } = require('uuid');

// ─── Multer ───────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
    cb(null, true);
  },
});

// ─── Constants ────────────────────────────────────────────────────────────────
const POSES = ['shocked', 'talking', 'thinking', 'smiling'];

// HF Inference API — instruct-pix2pix (image-to-image with text instruction)
// This endpoint accepts: { inputs: <base64 image>, parameters: { prompt } }
// and returns a binary image blob.
const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix';

// Pose-specific aging instructions
const POSE_INSTRUCTIONS = {
  shocked:  'make this person look 60 years old with wide shocked eyes and a surprised expression, photorealistic, keep the same person',
  talking:  'make this person look 60 years old, mouth slightly open as if speaking, neutral relaxed expression, photorealistic, keep the same person',
  thinking: 'make this person look 60 years old with a thoughtful expression, looking slightly upward, photorealistic, keep the same person',
  smiling:  'make this person look 60 years old with a warm genuine smile and kind eyes, photorealistic, keep the same person',
};

const DEFAULT_FALLBACKS = {
  shocked: path.join(__dirname, '..', 'assets', 'default', 'sup.png'),
  talking: path.join(__dirname, '..', 'assets', 'default', 'tal.png'),
  thinking: path.join(__dirname, '..', 'assets', 'default', 'thoug.png'),
  smiling: path.join(__dirname, '..', 'assets', 'default', 'smil.png'),
};


// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Call HF instruct-pix2pix for a single pose.
 * Returns a Buffer of the generated image.
 */
async function callHFPix2Pix(imageBuffer, mimeType, instruction, token) {
  // HF Inference API for image-to-image:
  // POST with the image as base64 in the JSON body under "inputs",
  // and the edit instruction under "parameters.prompt".
  const base64Image = imageBuffer.toString('base64');

  const response = await axios.post(
    HF_MODEL_URL,
    {
      inputs: base64Image,
      parameters: {
        prompt:               instruction,
        num_inference_steps:  20,        // lower = faster, higher = better quality
        image_guidance_scale: 1.5,       // how closely to follow original image
        guidance_scale:       7.5,       // how closely to follow text prompt
      },
    },
    {
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept:         'image/jpeg',
      },
      responseType: 'arraybuffer',
      timeout: 90_000,  // pix2pix can take 30-60s on free tier
    }
  );

  if (response.status !== 200) {
    throw new Error(`HF returned status ${response.status}`);
  }

  // HF may return a JSON error even with 200 — check content-type
  const contentType = response.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    const json = JSON.parse(Buffer.from(response.data).toString('utf8'));
    // Handle model loading (503 with estimated_time)
    if (json.error) throw new Error(json.error);
  }

  return Buffer.from(response.data);
}

/**
 * Poll until the model is loaded. HF returns 503 with { estimated_time }
 * while the model is cold-starting. We retry up to maxAttempts times.
 */
async function callWithRetry(imageBuffer, mimeType, instruction, token, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await callHFPix2Pix(imageBuffer, mimeType, instruction, token);
    } catch (err) {
      const isModelLoading = err.message?.toLowerCase().includes('loading') ||
                             err.response?.status === 503;
      if (isModelLoading && attempt < maxAttempts) {
        const waitMs = (err.response?.data?.estimated_time || 20) * 1000;
        console.log(`[Avatars] Model loading, waiting ${Math.round(waitMs / 1000)}s before retry ${attempt + 1}/${maxAttempts}...`);
        await new Promise(r => setTimeout(r, Math.min(waitMs, 30_000)));
        continue;
      }
      throw err;
    }
  }
}

// ─── POST /api/avatars/generate ───────────────────────────────────────────────
router.post('/generate', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Photo is required' });
  }

  const userId     = uuidv4();
  const folderPath = path.join(__dirname, '..', 'assets', userId);
  fs.mkdirSync(folderPath, { recursive: true });

  const originalExt  = req.file.mimetype === 'image/png' ? 'png' : 'jpg';
  const originalPath = path.join(folderPath, `original.${originalExt}`);
  fs.writeFileSync(originalPath, req.file.buffer);

  const avatarUrlsForResponse = {};
  const HF_TOKEN = process.env.HF_API_TOKEN;

  // ── Generate 4 poses ────────────────────────────────────────────────────────
  for (const pose of POSES) {

    // ── No token / token placeholder → use original photo as fallback ──────────
    if (!HF_TOKEN || HF_TOKEN === 'hf_YOUR_TOKEN_HERE') {
      console.log(`[Avatars] No HF token — copying original as fallback for pose: ${pose}`);
      const fallbackPath = path.join(folderPath, `${pose}.png`);
      fs.copyFileSync(DEFAULT_FALLBACKS[pose], fallbackPath);

      avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.png`;
      continue;
    }

    // ── Call HF instruct-pix2pix ────────────────────────────────────────────────
    try {
      console.log(`[Avatars] Generating pose "${pose}" via HF instruct-pix2pix...`);

      const imgBuffer = await callWithRetry(
        req.file.buffer,
        req.file.mimetype,
        POSE_INSTRUCTIONS[pose],
        HF_TOKEN
      );

      const outputPath = path.join(folderPath, `${pose}.jpg`);
      fs.writeFileSync(outputPath, imgBuffer);
      avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.jpg`;

      console.log(`[Avatars] ✓ Pose "${pose}" generated`);

    } catch (err) {
      console.warn(`[Avatars] Pose "${pose}" failed (${err.message}), using default fallback`);

      try {
        const fallbackPath = path.join(folderPath, `${pose}.png`);
        fs.copyFileSync(DEFAULT_FALLBACKS[pose], fallbackPath);

        avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.png`;

      } catch (fallbackErr) {
        console.warn(`[Avatars] Default fallback ALSO failed, using original`);

        const fallbackPath = path.join(folderPath, `${pose}.${originalExt}`);
        fs.copyFileSync(originalPath, fallbackPath);

        avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.${originalExt}`;
      }
    }
  }

  const avatarResult = {
    ...avatarUrlsForResponse,
    folder_path:  `/assets/${userId}`,
    generated_at: new Date(),
  };

  console.log(`[Avatars] All poses done for user ${userId}`);

  return res.json({
    success: true,
    userId,
    avatars: avatarResult,
  });
});

// ─── GET /api/avatars/:userId ─────────────────────────────────────────────────
router.get('/:userId', (req, res) => {
  const { userId }  = req.params;
  const folderPath  = path.join(__dirname, '..', 'assets', userId);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'No avatars found for this user' });
  }

  const files   = fs.readdirSync(folderPath);
  const avatars = {};
  for (const pose of POSES) {
    const match = files.find(f => f.startsWith(pose));
    if (match) avatars[`${pose}_url`] = `/assets/${userId}/${match}`;
  }
  avatars.folder_path = `/assets/${userId}`;

  return res.json({ userId, avatars });
});

module.exports = router;