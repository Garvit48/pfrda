// ══════════════════════════════════════════════════════════════════
// FUTUREYOU — VISUAL NOVEL SCRIPT
// Pure scene data. No logic here — only text, inputs, avatar/bg keys.
// Load this before futureyou_visual_novel.html (via <script src>)
// ══════════════════════════════════════════════════════════════════

const AVATAR_POSES = {
  shocked:
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  talking:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  thinking:
    "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80",
  smiling:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
};

const BACKGROUNDS = {
  dim_room:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  window:
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80",
  garden:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
  study:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80",
};

function buildScript(name, userData) {
  return [
    // ════════════════════════════════════════════════════════════════
    // ACT 1 — THE ENCOUNTER
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.shocked,
      speaker: "Future You",
      text: `...wait.\n\nIs that— is that really me?\n\nI haven't seen that face in so long. You look like you've seen a ghost. Don't worry — I'm not here to frighten you.`,
    },
    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: `I'm you. Thirty-something years later.\n\nI know how that sounds. But just stay with me for a few minutes. I have things to tell you that nobody told me — and I really wish they had.`,
    },
    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `My memory isn't what it used to be. Remind me — what do people call you?`,
      input: {
        type: "text",
        placeholder: "Your name...",
        key: "confirmedName",
        default: name,
        submitLabel: "That's me",
      },
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: () =>
        `${userData.confirmedName || name}.\n\nOf course. How could I forget.\n\nI've been waiting a long time for this conversation. Sit down — I want to tell you a story.`,
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 2 — THE STORY (why this matters)
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: `When I was your age, I thought retirement was something that happened to other people. Old people. Not me.\n\nI was busy. I was earning. I was spending.\n\nEvery month I told myself: "I'll start saving properly next year."`,
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: `Next year turned into the year after. Then the decade after.\n\nBy the time I actually sat down and did the math, I was 42. And I realised I had almost nothing set aside for retirement.\n\nNothing. After twenty years of working.`,
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.shocked,
      speaker: "Future You",
      text: `Do you know what that feels like? To look at a number that's supposed to carry you through the rest of your life — and feel your stomach drop?\n\nI don't want that for you. That's why I'm here.`,
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 3 — WHAT IS NPS (explained like a human, not a brochure)
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: `Now — I need to tell you about something called NPS. The National Pension System.\n\nBefore your eyes glaze over — I know. It sounds boring. It sounds like something your father's accountant mentions once and you promptly forget. I ignored it for years.`,
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: `But here's what NPS actually is, in plain language:\n\nYou put aside a small amount every month. It goes into an account that grows over time — invested in markets, managed by professionals. By the time you retire, it's become a corpus. A real fund that pays you every month for the rest of your life.`,
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: `Think of it like this. If you put away just ₹2,000 a month starting at 25 — by the time you're 60, at a conservative 10% return, that becomes nearly ₹76 lakhs.\n\n₹2,000 a month. Less than a dinner out twice a week.\n\nThat's the power of starting early.`,
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.shocked,
      speaker: "Future You",
      text: `And there's something else nobody talks about.\n\nThe government actually rewards you for doing this. You get a tax deduction on your NPS contributions — up to ₹1.5 lakh under Section 80C.\n\nBut that's not even the best part.`,
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: `There's a separate deduction — Section 80CCD(1B) — that gives you an additional ₹50,000 off your taxable income. Exclusively for NPS.\n\nIf you're in the 20% tax bracket, that's ₹10,000 back in your pocket every year. Just for saving for yourself.\n\nI left that on the table for a decade. Don't make my mistake.`,
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 4 — GETTING TO KNOW YOU (age & retirement timeline)
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `Alright. I've talked enough. Let me learn about where you are right now.\n\nHow old are you? I genuinely can't remember what year I'm visiting.`,
      input: {
        type: "range",
        min: 18,
        max: 45,
        default: 25,
        key: "age",
        label: (v) => `${v} years old`,
        submitLabel: "That's right",
      },
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const age = parseInt(userData.age) || 25;
        if (age <= 24)
          return `${age}. You're so young.\n\nI want to reach through this screen and shake you — in the best way. The math at your age is extraordinary. Every rupee you invest now is worth so much more than one invested at 35. Time is your most valuable asset right now. Not money.`;
        if (age <= 30)
          return `${age}. Good. Still early enough that compound interest is firmly on your side.\n\nMost people your age are thinking about EMIs, travel, upgrading their phone. Very few are thinking about retirement. That's exactly why the ones who do end up so far ahead.`;
        if (age <= 35)
          return `${age}. You still have time — more than enough, if you're intentional about it now.\n\nI started at 38. If I'd started at your age, things would have been very different. Don't waste this window.`;
        return `${age}. Okay. We don't have the luxury of waiting.\n\nBut the good news is — it's still not too late. We just have to be smarter about it. Let's see what we're working with.`;
      },
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `And when do you want to stop working? Not when society says you should — when do *you* want to?`,
      input: {
        type: "range",
        min: 50,
        max: 70,
        default: 60,
        key: "retirementAge",
        label: (v) => `Age ${v}`,
        submitLabel: "That's the plan",
      },
    },
    {
      bg: BACKGROUNDS.window,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: () => {
        const yrs =
          (parseInt(userData.retirementAge) || 60) -
          (parseInt(userData.age) || 25);
        const age = parseInt(userData.age) || 25;
        if (yrs >= 35)
          return `${userData.retirementAge}. You have ${yrs} years.\n\nThat's actually incredible. With ${yrs} years of compounding, even modest monthly contributions become something extraordinary. The math is completely on your side — as long as you start now.`;
        if (yrs >= 25)
          return `${userData.retirementAge}. ${yrs} years to go.\n\nThat's a solid window. Not infinite — but more than enough to build real security if you're consistent. Let's make every year count.`;
        if (yrs >= 15)
          return `${userData.retirementAge}. ${yrs} years. Okay, we need to be serious.\n\nIt's still doable — but we can't afford to waste time. The good news? People who start late often save more aggressively, which can close the gap.`;
        return `${userData.retirementAge}. That's only ${yrs} years. I won't sugarcoat it — we're working against the clock.\n\nBut every year you contribute now still matters enormously. Let's figure out what's possible.`;
      },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 5 — YOUR WORK & MONEY
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `Tell me about your work. What do you do?`,
      input: {
        type: "mcq",
        key: "employment",
        options: [
          { label: "Salaried — central/state government", value: "govt" },
          { label: "Salaried — private company", value: "private" },
          { label: "Self-employed / freelancer", value: "self" },
          { label: "Still a student", value: "student" },
        ],
      },
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const e = userData.employment;
        if (e === "govt")
          return `Government service. You know, government employees actually have some of the best NPS terms in the country.\n\nYour employer — the government — contributes 14% of your basic salary into your NPS account. That's on top of your own contributions. It's genuinely one of the best retirement benefits that exists in India.`;
        if (e === "private")
          return `Private sector. Same as me.\n\nHere's something most private employees don't know — your employer can contribute to your NPS too, and it's completely tax-free for you under Section 80CCD(2). It's worth asking your HR department about it. Many companies offer it. Most employees never ask.`;
        if (e === "self")
          return `Self-employed. I was for a while too.\n\nHonestly, this is where NPS is most underused. When you're on your own, there's no EPF, no employer safety net. NPS is one of the most powerful tools you have — and the tax deduction of up to 20% of your gross income under 80CCD(1) is something most freelancers completely ignore.`;
        return `A student. That means you're earlier than most people who ever find this.\n\nYou can open an NPS account as soon as you start earning. Even ₹500 a month from your first salary is worth infinitely more than waiting five years. Remember this conversation when you get your first paycheck.`;
      },
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `What does your monthly take-home look like? The actual number that hits your account — roughly.`,
      input: {
        type: "select",
        key: "monthlyIncome",
        placeholder: "Monthly take-home",
        submitLabel: "That's about right",
        options: [
          { label: "Under ₹25,000", value: "20000" },
          { label: "₹25,000 – ₹40,000", value: "32500" },
          { label: "₹40,000 – ₹60,000", value: "50000" },
          { label: "₹60,000 – ₹1,00,000", value: "80000" },
          { label: "₹1,00,000 – ₹1,50,000", value: "125000" },
          { label: "Above ₹1,50,000", value: "175000" },
        ],
      },
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const inc = parseInt(userData.monthlyIncome) || 50000;
        const annual = inc * 12;
        const fmtL = (n) =>
          n >= 100000
            ? `₹${(n / 100000).toFixed(1)}L`
            : `₹${n.toLocaleString("en-IN")}`;
        const suggest = Math.round((inc * 0.1) / 500) * 500;
        return `${fmtL(annual)} a year.\n\nThat's a real number to work with. You know what I'd tell my younger self? Don't wait until you feel "comfortable" to start. That comfort never comes — lifestyle always expands to meet income.\n\nSomething like ${fmtL(suggest)} a month into NPS — just 10% — would have changed everything for me.`;
      },
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `One more money question — which tax regime are you on? This will determine exactly how much NPS saves you on taxes each year.`,
      input: {
        type: "mcq",
        key: "taxRegime",
        options: [
          {
            label: "Old regime — I claim deductions like 80C, HRA",
            value: "old",
          },
          { label: "New regime — lower rates, fewer deductions", value: "new" },
          { label: "I'm not sure / my employer decides", value: "old" },
        ],
      },
    },
    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () =>
        userData.taxRegime === "old"
          ? `Old regime — smart, if you have enough deductions to make it worth it.\n\nNPS is actually one of the most powerful tools in the old regime toolkit. Between 80C and the exclusive 80CCD(1B) deduction, you can shield up to ₹2 lakh of income from tax every year.\n\nQuick question — how much have you already invested in 80C instruments this year?`
          : `New regime. Okay — the landscape is a bit different for you.\n\nYou don't get the full 80C benefit, but your employer's NPS contribution is still tax-free, and the returns on your investment compound just the same.\n\nDoes your employer contribute to NPS for you?`,
      input: () =>
        userData.taxRegime === "old"
          ? {
              type: "select",
              key: "existing80C",
              placeholder: "Existing 80C investments this year",
              submitLabel: "That's about right",
              options: [
                { label: "Nothing yet", value: "0" },
                { label: "Under ₹50,000", value: "25000" },
                { label: "₹50,000 – ₹1,00,000", value: "75000" },
                { label: "₹1,00,000 – ₹1,50,000", value: "125000" },
                { label: "Already maxed at ₹1,50,000", value: "150000" },
              ],
            }
          : {
              type: "mcq",
              key: "employerNPS",
              options: [
                { label: "Yes — my employer contributes to NPS", value: "yes" },
                { label: "No / I'm not sure", value: "no" },
              ],
            },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 6 — YOUR NPS STATUS
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `Now — the most important question. Where are you with NPS right now?`,
      input: {
        type: "mcq",
        key: "npsStatus",
        options: [
          {
            label: "I have an account and contribute regularly",
            value: "active",
          },
          {
            label: "I have an account but contributions lapsed",
            value: "inactive",
          },
          { label: "I've heard of it but never opened one", value: "heard" },
          {
            label: "I'm hearing about this properly for the first time",
            value: "none",
          },
        ],
      },
    },
    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const k = userData.npsStatus;
        if (k === "active")
          return `You're already doing it. You have no idea how far ahead of most people that makes you.\n\nWhen I finally started contributing at 38, I met someone at work who'd been doing it since 24. The difference in their corpus versus mine — for the same monthly amount — was staggering. You're that person. Keep going.`;
        if (k === "inactive")
          return `A dormant account. I had one of those too.\n\nYou know the hardest part? Restarting. The guilt of having stopped makes it easier to just... not. But here's the thing — the money that's already in your account has been growing this whole time. It's not lost. It just needs you to come back.\n\nWhat's the current balance sitting there?`;
        if (k === "heard")
          return `You've heard of it but never taken the step. That's where most people get stuck.\n\nThe process sounds complicated — PRAN numbers, CRA accounts, fund managers. I know. But I promise you, opening an NPS account is less complicated than filing your taxes. We'll get to all of that.\n\nFor now, let's figure out what we're building towards.`;
        return `First time hearing about it properly. That's completely okay — I wish I'd learned earlier too.\n\nHere's what matters: you're learning about it now. That already puts you ahead of where I was at your age. Everything we talk about from here on out will make complete sense by the end, I promise.`;
      },
    },
    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: () =>
        userData.npsStatus === "active" || userData.npsStatus === "inactive"
          ? `What's your current NPS Tier I balance? Check your CRA app or the NSDL portal if you need to — it's worth knowing.`
          : `Since you're starting fresh, let me ask — what do you think you could realistically set aside for NPS each month? Even a small amount is infinitely better than zero.`,
      skip: () => false,
      input: () => {
        const hasAccount =
          userData.npsStatus === "active" || userData.npsStatus === "inactive";
        return {
          type: "select",
          key: hasAccount ? "currentCorpus" : "monthlyContribution",
          placeholder: hasAccount ? "Current Tier I balance" : "Monthly amount",
          submitLabel: "Got it",
          options: hasAccount
            ? [
                { label: "Under ₹50,000", value: "25000" },
                { label: "₹50,000 – ₹2,00,000", value: "125000" },
                { label: "₹2,00,000 – ₹5,00,000", value: "350000" },
                { label: "₹5,00,000 – ₹10,00,000", value: "750000" },
                { label: "Above ₹10,00,000", value: "1200000" },
              ]
            : [
                { label: "₹500 – ₹1,000 / month", value: "750" },
                { label: "₹1,000 – ₹3,000 / month", value: "2000" },
                { label: "₹3,000 – ₹6,000 / month", value: "4500" },
                { label: "₹6,000 – ₹10,000 / month", value: "8000" },
                { label: "Above ₹10,000 / month", value: "12000" },
              ],
        };
      },
    },
    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `And how much are you putting in each month right now?`,
      skip: () =>
        userData.npsStatus !== "active" && userData.npsStatus !== "inactive",
      input: {
        type: "select",
        key: "monthlyContribution",
        placeholder: "Monthly NPS contribution",
        submitLabel: "That's right",
        options: [
          { label: "₹500 – ₹1,000", value: "750" },
          { label: "₹1,000 – ₹3,000", value: "2000" },
          { label: "₹3,000 – ₹6,000", value: "4500" },
          { label: "₹6,000 – ₹10,000", value: "8000" },
          { label: "Above ₹10,000", value: "12000" },
        ],
      },
    },
    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const contrib = parseInt(userData.monthlyContribution) || 0;
        const corpus = parseInt(userData.currentCorpus) || 0;
        const age = parseInt(userData.age) || 25;
        const retAge = parseInt(userData.retirementAge) || 60;
        const yrs = retAge - age;
        const projected =
          contrib > 0
            ? Math.round(
                corpus * Math.pow(1.1, yrs) +
                  contrib *
                    ((Math.pow(1 + 0.1 / 12, yrs * 12) - 1) / (0.1 / 12)) *
                    (1 + 0.1 / 12),
              )
            : Math.round(corpus * Math.pow(1.1, yrs));
        const fmtCr = (n) =>
          n >= 10000000
            ? `₹${(n / 10000000).toFixed(1)} crore`
            : n >= 100000
              ? `₹${(n / 100000).toFixed(0)} lakh`
              : `₹${n.toLocaleString("en-IN")}`;
        if (contrib > 0 || corpus > 0) {
          return `If you stay consistent, here's a rough picture:\n\nBased on what you've told me, you're on track for approximately ${fmtCr(projected)} by age ${retAge}.\n\nBut we can do better. Your dashboard will show you exactly what needs to change — and by how much.`;
        }
        return `Starting from zero isn't a problem — it's just a starting line.\n\nEven ₹1,000 a month from today, at 10% average returns, becomes over ₹35 lakhs by the time you're 60. Your dashboard will show you a full picture once we're done here.`;
      },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 7 — THE QUIZ MOMENT (fun, not preachy)
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.study,
      avatar: AVATAR_POSES.shocked,
      speaker: "Future You",
      text: `One thing that made me genuinely angry when I finally learned it —\n\nThere's a separate tax deduction, Section 80CCD(1B), that gives you ₹50,000 off your taxable income. Exclusively for NPS. On top of the ₹1.5 lakh 80C limit.\n\nI paid full tax on that ₹50,000 for over a decade. Twelve years. Had absolutely no idea this existed.\n\nHad you heard of this?`,
      input: {
        type: "mcq",
        key: "taxFactKnown",
        isQuiz: true,
        options: [
          {
            label: "Yes — Section 80CCD(1B), I know it well",
            value: "yes",
            correct: true,
          },
          {
            label: "I've heard of 80C but not this specific one",
            value: "partial",
          },
          { label: "No, this is news to me", value: "no" },
        ],
        explanation: {
          correct: `You actually knew. I'm impressed — genuinely.\n\nMost people your age have no idea this exists. The fact that you know it means you're already thinking about this the right way.`,
          wrong: `Now you know. Section 80CCD(1B). Write it down somewhere.\n\nIf you're in the 20% tax bracket, that's ₹10,000 back in your hands every year just for saving for yourself. That's not nothing — that's a flight ticket. A phone upgrade. A month of groceries.`,
        },
      },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 8 — THE DREAM
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: `Last thing. I want to know what you're actually building towards.\n\nForget financial planning for a second. When you retire — what does that life feel like?`,
      input: {
        type: "mcq",
        key: "retirementLifestyle",
        options: [
          {
            label: "Travel — see the world while I still can",
            value: "travel",
          },
          { label: "Family — be there for the people I love", value: "family" },
          {
            label: "Peace — quiet, simple, completely stress-free",
            value: "peace",
          },
          {
            label: "Active — still building things, just on my terms",
            value: "active",
          },
        ],
      },
    },
    {
      bg: BACKGROUNDS.garden,
      avatar: AVATAR_POSES.talking,
      speaker: "Future You",
      text: () => {
        const l = userData.retirementLifestyle;
        if (l === "travel")
          return `Travel. Yes.\n\nI wanted that too. And I got some of it — not as much as I dreamed of, but enough. The trips I couldn't take were the ones I hadn't saved for. The financial stress of a trip you can't afford follows you into every moment of it.\n\nThe version of retirement you're imagining? It's entirely possible. It just requires the work you're about to start.`;
        if (l === "family")
          return `Family. That one hit me.\n\nYou know what I realised at 60? The most meaningful thing I could do for my family was not be a burden to them. Not have them worry about whether I was okay.\n\nThe greatest gift you can give the people you love is financial security — yours. Because it eventually becomes theirs too.`;
        if (l === "peace")
          return `Peace.\n\nDo you know what robs people of peace in retirement? It's not illness, usually. It's money anxiety. Watching every rupee. Wondering if the savings will last.\n\nWe're going to build you a retirement where that particular fear doesn't exist. That's what this is all about.`;
        return `Active — on your own terms. I love that.\n\nThe key phrase is "your own terms." When you have financial security, work becomes a choice, not a necessity. That changes everything — your creativity, your energy, your relationship with what you do.\n\nLet's make sure you get there.`;
      },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 9 — ACCOUNT SETUP
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `Almost done. I need one way to reach you — so we can continue this conversation whenever you come back.\n\nWhat's your email?`,
      input: {
        type: "text",
        placeholder: "your@email.com",
        key: "email",
        submitLabel: "That's it",
      },
    },
    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.thinking,
      speaker: "Future You",
      text: `And a password — something that's yours. This space is private.`,
      input: {
        type: "password",
        placeholder: "Choose a password...",
        key: "password",
        submitLabel: "Done",
      },
    },

    // ════════════════════════════════════════════════════════════════
    // ACT 10 — THE SEND-OFF
    // ════════════════════════════════════════════════════════════════

    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: () =>
        `I'm almost out of time, ${userData.confirmedName || name}.\n\nThese visits don't last long. But I want to leave you with something.\n\nYou came here today. You sat through this. You answered the questions honestly. That already separates you from the version of me who didn't — who kept putting it off.\n\nYou're already ahead.`,
    },
    {
      bg: BACKGROUNDS.dim_room,
      avatar: AVATAR_POSES.smiling,
      speaker: "Future You",
      text: () =>
        `Your dashboard is ready. It'll show you exactly where you stand, what your retirement looks like on your current path, and what small changes would change everything.\n\nGo look at it. And then come back to talk whenever you need to.\n\nI'll be here.`,
    },
  ];
}
