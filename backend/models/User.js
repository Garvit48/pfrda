const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const onboardingResponseSchema = new mongoose.Schema({
  scene_key:    { type: String, required: true },
  answer:       { type: String },
  answered_at:  { type: Date, default: Date.now },
  quiz_correct: { type: Boolean, default: null },
}, { _id: false });

const userSchema = new mongoose.Schema({

  // ── Auth ──────────────────────────────────────────
  email:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  password_hash: { type: String },

  // ── Identity ──────────────────────────────────────
  name:               { type: String, trim: true },
  phone:              { type: String },
  date_of_birth:      { type: Date },
  age:                { type: Number },
  gender:             { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  pan_number:         { type: String },
  aadhaar_last4:      { type: String },
  photo_url:          { type: String },
  preferred_language: { type: String, enum: ['en', 'hi', 'ta', 'te', 'kn', 'mr', 'bn'], default: 'en' },

  // ── Employment & Income ───────────────────────────
  employment: {
    type:                  { type: String, enum: ['govt', 'private', 'self', 'student', 'other'] },
    income_range:          { type: String, enum: ['under25k', '25k-50k', '50k-1L', '1L-2L', 'above2L'] },
    monthly_income_exact:  { type: Number },
    employer_name:         { type: String },
    employer_type:         { type: String, enum: ['central_govt', 'state_govt', 'psu', 'private', 'startup'] },
    work_city:             { type: String },
    work_state:            { type: String },
    tax_regime:            { type: String, enum: ['old', 'new'] },
    annual_ctc:            { type: Number },
    existing_80c_investments: { type: Number, default: 0 },
  },

  // ── NPS Account ───────────────────────────────────
  nps: {
    has_account:           { type: Boolean, default: false },
    pran_number:           { type: String },
    account_type:          { type: String, enum: ['govt', 'corporate', 'all_citizen'] },
    tier1_balance:         { type: Number, default: 0 },
    tier2_balance:         { type: Number, default: 0 },
    monthly_contribution:  { type: Number, default: 0 },
    contribution_start_date: { type: Date },
    fund_manager:          { type: String },
    asset_allocation_equity: { type: Number },
    asset_allocation_debt:   { type: Number },
    auto_debit_enabled:    { type: Boolean, default: false },
    nominee_name:          { type: String },
  },

  // ── Financial Goals ───────────────────────────────
  goals: {
    retirement_age_target:      { type: Number },
    monthly_retirement_income:  { type: Number },
    retirement_lifestyle:       { type: String, enum: ['travel', 'family', 'peace', 'active'] },
    corpus_target:              { type: Number },
    risk_appetite:              { type: String, enum: ['low', 'medium', 'high'] },
    other_investments:          { type: [String], default: [] },
    has_epf:                    { type: Boolean },
    epf_balance:                { type: Number },
  },

  // ── Gamification ──────────────────────────────────
  gamification: {
    nps_readiness_score:  { type: Number, default: 300, min: 300, max: 900 },
    streak_days:          { type: Number, default: 0 },
    streak_last_activity: { type: Date },
    xp_total:             { type: Number, default: 0 },
    badges_earned:        { type: [String], default: [] },
    quests_completed:     { type: [String], default: [] },
    tribe_id:             { type: mongoose.Schema.Types.ObjectId, ref: 'Tribe' },
    modules_completed:    { type: [String], default: [] },
    quiz_scores:          { type: [Number], default: [] },
  },

  // ── Avatar Assets ─────────────────────────────────
  avatars: {
    shocked_url:      { type: String },
    talking_url:      { type: String },
    thinking_url:     { type: String },
    smiling_url:      { type: String },
    folder_path:      { type: String },
    generated_at:     { type: Date },
  },

  // ── Onboarding ────────────────────────────────────
  onboarding: {
    completed:          { type: Boolean, default: false },
    completed_at:       { type: Date },
    nps_knowledge_level: { type: String, enum: ['none', 'heard', 'active'] },
    tax_fact_known:     { type: Boolean },
    responses:          { type: [onboardingResponseSchema], default: [] },
  },

  // ── Meta ──────────────────────────────────────────
  meta: {
    last_active_at:   { type: Date, default: Date.now },
    referral_code:    { type: String },
    referred_by:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    app_version:      { type: String },
    notification_prefs: {
      email:  { type: Boolean, default: true },
      push:   { type: Boolean, default: true },
      sms:    { type: Boolean, default: false },
    },
  },

}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password_hash);
};

// Never return password in responses
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
