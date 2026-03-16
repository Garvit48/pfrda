const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// All routes below require a valid JWT
router.use(auth);

// ── GET /api/users/me ─────────────────────────────────────────────
// Returns the full user profile (used by dashboard on load)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ── PATCH /api/users/me ───────────────────────────────────────────
// General profile update — used by the "complete onboarding" page on dashboard
// Accepts any top-level or nested fields; merges with existing data
router.patch('/me', async (req, res) => {
  try {
    // Flatten nested updates using dot-notation so Mongo merges correctly
    // e.g. { employment: { type: 'private' } } → { 'employment.type': 'private' }
    const updates = flattenObject(req.body);

    // Never allow overwriting auth fields via this endpoint
    delete updates.password_hash;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toSafeObject());
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed', detail: err.message });
  }
});

// ── PATCH /api/users/me/nps ───────────────────────────────────────
// Dedicated NPS data update (dashboard NPS section)
router.patch('/me/nps', async (req, res) => {
  try {
    const npsUpdates = {};
    for (const [key, value] of Object.entries(req.body)) {
      npsUpdates[`nps.${key}`] = value;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: npsUpdates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ nps: user.nps });
  } catch (err) {
    res.status(500).json({ error: 'NPS update failed', detail: err.message });
  }
});

// ── PATCH /api/users/me/gamification ─────────────────────────────
// Update score, streak, badges, xp etc.
router.patch('/me/gamification', async (req, res) => {
  try {
    const { add_badge, add_xp, add_quest, update_streak, score_delta } = req.body;
    const ops = {};

    if (add_badge)     ops.$addToSet = { 'gamification.badges_earned': add_badge };
    if (add_quest)     ops.$addToSet = { ...(ops.$addToSet || {}), 'gamification.quests_completed': add_quest };
    if (add_xp)        ops.$inc = { 'gamification.xp_total': add_xp };
    if (score_delta)   ops.$inc = { ...(ops.$inc || {}), 'gamification.nps_readiness_score': score_delta };
    if (update_streak !== undefined) {
      ops.$set = {
        'gamification.streak_days': update_streak,
        'gamification.streak_last_activity': new Date(),
      };
    }

    const user = await User.findByIdAndUpdate(req.userId, ops, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ gamification: user.gamification });
  } catch (err) {
    res.status(500).json({ error: 'Gamification update failed', detail: err.message });
  }
});

// ── POST /api/users/me/onboarding-response ────────────────────────
// Push a single scene answer — can be called per scene or in bulk at the end
router.post('/me/onboarding-response', async (req, res) => {
  try {
    const { scene_key, answer, quiz_correct } = req.body;
    if (!scene_key) return res.status(400).json({ error: 'scene_key is required' });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          'onboarding.responses': { scene_key, answer, quiz_correct: quiz_correct ?? null },
        },
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ responses: user.onboarding.responses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// ── DELETE /api/users/me ──────────────────────────────────────────
// Account deletion
router.delete('/me', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

// ── Helper: flatten nested object to dot-notation keys ───────────
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], fullKey));
    } else {
      acc[fullKey] = obj[key];
    }
    return acc;
  }, {});
}

module.exports = router;
