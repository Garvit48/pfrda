const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register
// Called at end of visual novel with all collected data + email + password
router.post('/register', async (req, res) => {
  try {
    const {
      email, password,
      name, age, photo_url,
      employment_type, income_range,
      nps_knowledge_level, tax_fact_known,
      tax_regime, existing_80c, employer_nps,
      retirement_age, retirement_lifestyle,
      onboarding_responses,
      avatars,
      nps: npsPayload,
      goals: goalsPayload,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = new User({
      email,
      password_hash: password,
      name,
      age,
      photo_url,
      employment: {
        type: employment_type,
        income_range,
        monthly_income_exact: parseInt(income_range) || 0,
        tax_regime: tax_regime || 'old',
        existing_80c_investments: parseInt(existing_80c) || 0,
      },
      nps: {
        has_account:          npsPayload?.has_account          ?? false,
        tier1_balance:        npsPayload?.tier1_balance        ?? 0,
        monthly_contribution: npsPayload?.monthly_contribution ?? 0,
      },
      goals: {
        retirement_age_target:   goalsPayload?.retirement_age_target ?? parseInt(retirement_age) ?? 60,
        retirement_lifestyle:    goalsPayload?.retirement_lifestyle  ?? retirement_lifestyle,
      },
      gamification: {
        nps_readiness_score: req.body.nps_readiness_score || 300,
      },
      onboarding: {
        completed: true,
        completed_at: new Date(),
        nps_knowledge_level,
        tax_fact_known,
        responses: onboarding_responses || [],
      },
      avatars: avatars || {},
    });

    await user.save();

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.meta.last_active_at = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
