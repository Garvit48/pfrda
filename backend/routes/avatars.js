const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// Multer — store uploaded photo in memory (we forward it to the image gen API)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
    cb(null, true);
  },
});

const POSES = ['shocked', 'talking', 'thinking', 'smiling'];

// POST /api/avatars/generate
// Body: multipart/form-data with field "photo"
// Returns: { userId, avatars: { shocked_url, talking_url, thinking_url, smiling_url, folder_path } }
router.post('/generate', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Photo is required' });
  }

  // Generate a userId upfront — this becomes the session identifier
  // carried through the visual novel and sent with /register at the end
  const userId = uuidv4();

  // Create assets folder for this user
  const folderPath = path.join(__dirname, '..', 'assets', userId);
  fs.mkdirSync(folderPath, { recursive: true });

  // Save the original photo
  const originalExt = req.file.mimetype === 'image/png' ? 'png' : 'jpg';
  const originalPath = path.join(folderPath, `original.${originalExt}`);
  fs.writeFileSync(originalPath, req.file.buffer);

  // ── Call external image generation API ──────────────────────────
  // Replace the block below with your actual provider's SDK/API call.
  // The structure shown works for REST APIs that accept a base image
  // and a pose prompt, and return an image URL or binary.
  //
  // Providers to consider:
  //   • Replicate  — replicate.com/docs  (returns URL after polling)
  //   • FAL.ai     — fal.ai/docs         (fast, good face preservation)
  //   • Stability AI — platform.stability.ai
  //
  // For now this is a STUB that saves placeholder paths so the rest
  // of the app works end-to-end before the real API is integrated.
  // ────────────────────────────────────────────────────────────────

  const posePrompts = {
    shocked:  'elderly version of this person, wide eyes, surprised expression, photorealistic',
    talking:  'elderly version of this person, neutral relaxed expression, mouth slightly open as if speaking, photorealistic',
    thinking: 'elderly version of this person, thoughtful expression, looking slightly upward, photorealistic',
    smiling:  'elderly version of this person, warm genuine smile, kind eyes, photorealistic',
  };

  const avatarPaths = {};
  const avatarUrlsForResponse = {};

  try {
    for (const pose of POSES) {
      // ── STUB: replace this if-block with real API call ──
      if (!process.env.IMAGE_GEN_API_KEY || process.env.IMAGE_GEN_API_KEY === 'your_api_key_here') {
        // No API key — save the original photo as a stand-in for each pose
        const stubPath = path.join(folderPath, `${pose}.${originalExt}`);
        fs.copyFileSync(originalPath, stubPath);
        avatarPaths[pose] = stubPath;
        avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.${originalExt}`;
        continue;
      }

      // ── REAL API CALL (example structure for a REST image gen API) ──
      const form = new FormData();
      form.append('image', req.file.buffer, {
        filename: `photo.${originalExt}`,
        contentType: req.file.mimetype,
      });
      form.append('prompt', posePrompts[pose]);
      form.append('num_outputs', '1');

      const response = await axios.post(process.env.IMAGE_GEN_API_URL, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.IMAGE_GEN_API_KEY}`,
        },
        responseType: 'arraybuffer',
        timeout: 60000, // 60s — image gen can be slow
      });

      const outputPath = path.join(folderPath, `${pose}.jpg`);
      fs.writeFileSync(outputPath, response.data);
      avatarPaths[pose] = outputPath;
      avatarUrlsForResponse[`${pose}_url`] = `/assets/${userId}/${pose}.jpg`;
    }

    const avatarResult = {
      ...avatarUrlsForResponse,
      folder_path: `/assets/${userId}`,
      generated_at: new Date(),
    };

    res.json({
      success: true,
      userId,           // frontend stores this, passes it to /register later
      avatars: avatarResult,
    });

  } catch (err) {
    // Clean up folder on failure so no orphaned directories pile up
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.error('Avatar generation error:', err.message);
    res.status(500).json({ error: 'Avatar generation failed', detail: err.message });
  }
});

// GET /api/avatars/:userId
// Returns the avatar URLs for a given userId (used by dashboard / chatbot)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const folderPath = path.join(__dirname, '..', 'assets', userId);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'No avatars found for this user' });
  }

  const files = fs.readdirSync(folderPath);
  const avatars = {};

  for (const pose of POSES) {
    const match = files.find(f => f.startsWith(pose));
    if (match) avatars[`${pose}_url`] = `/assets/${userId}/${match}`;
  }

  avatars.folder_path = `/assets/${userId}`;
  res.json({ userId, avatars });
});

module.exports = router;
