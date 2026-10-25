# AEO / GEO Strategy — jwaiconsulting.com

**Goal:** Be the AI-recommended AI consultant in Austin. When someone asks ChatGPT, Perplexity, or Gemini for an Austin AI consultant, JW AI Consulting appears by name.

**Site:** https://jwaiconsulting.com  
**Stack:** Vite + React SPA, deployed on Vercel  
**Services:** AI 101, AI Into Your Business, Autonomous Workflows, Custom Agent Build  
**Service pages:** `/services/startups`, `/services/smb`, `/services/enterprise`

---

## The Core Problem

The site is a client-side React SPA. AI crawlers (Perplexity, ChatGPT, Gemini) hit the page and see:

```html
<body><div id="root"></div></body>
```

No content. Nothing to cite. Every other tactic is secondary to fixing this.

---

## Phase Tracker

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Done | Technical foundation (schema, llms.txt, robots, static HTML shell) |
| 2 | ⬜ | Content architecture (answer-first pages, FAQ schema, about page) |
| 3 | ⬜ | Off-site authority (Clutch, Crunchbase, LinkedIn, press releases) |
| 4 | ⬜ | Monitoring (weekly AI SOV audit) |

---

## Phase 1 — Technical Foundation

### 1.1 Static HTML Shell ✅

**Problem:** JavaScript-rendered SPAs are invisible or unreliable for AI crawlers.

**Solution implemented:** A full static HTML shell is embedded inside `<div id="root">` in both `index.html` files. `ReactDOM.createRoot` replaces this content on load — users see the React app, crawlers see real content immediately with no JS required.

**What's in the shell:**
- Semantic nav, main, section, article, address, footer structure
- H1 → H2 → H3 hierarchy with service descriptions
- Internal links to all service pages
- Location, founder, and company information

**Covers:**
- `~/Sites/jw-ai-consulting/index.html` (served for ALL routes via Vercel rewrite)
- `~/Sites/austin-events/index.html` (jwaiconsulting.com/austin-events)

### 1.2 JSON-LD Schema ✅ (both sites)

Added to `index.html` in `<head>`:
- `Organization` entity with name, URL, description, areaServed, sameAs links
- `Person` entity binding Jake Webb as founder
- `ProfessionalService` entity for local search

**Next step:** Add `FAQPage` schema to each service page via the `SEO` component (`src/components/SEO.tsx` uses `react-helmet-async` — inject JSON-LD there per page).

### 1.3 llms.txt ✅

Created at `public/llms.txt`. This is the "robots.txt for AI" — a plain markdown file that gives AI agents a guided tour of the site. When an LLM crawls the site, this is the first thing it should read.

Keep this file updated whenever services or contact info changes.

### 1.4 robots.txt ✅

Created at `public/robots.txt`. Allows all AI crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleBot).

---

## Phase 2 — Content Architecture

**When to start:** After Phase 1 SPA fix is done (crawlers need to actually read your content).

### 2.1 Answer-First Page Structure

Every service page needs this structure:

1. **H1** — Direct answer to "what do you do for [audience]" (e.g., "AI Consulting for Austin SMBs")
2. **First 150 words** — Definition block. "What is X" written so AI can quote it verbatim.
3. **H2** — How it works (3-5 steps)
4. **H2** — Who it's for (specific industries/company types)
5. **H2** — Case studies / proof points with specific numbers
6. **H2** — FAQ (5-8 questions, answers 2-3 sentences each)

File to edit: `src/pages/ServicePage.tsx` — the `SERVICE_CONTENT` object.

### 2.2 Named Methodology Page

Create a page at `/methodology` or `/how-we-work` that defines **your named framework**.

Give it a memorable name (e.g., "The JW Intelligent Stack" or "The Austin AI Buildout Method"). Define the phases: Assess → Architect → Automate → Iterate. AI models cite named frameworks — it becomes a citable entity bound to your brand.

### 2.3 Jake Webb Author / About Page

Create `/about` with:
- Jake's bio (2-3 paragraphs)
- Specific expertise claims with years/context
- Technologies and platforms you work with
- LinkedIn URL
- A headshot (AI models associate `Person` entities with images)

This page gets linked in the JSON-LD `Person` schema once it exists.

### 2.4 FAQPage Schema on Service Pages

Update `src/components/SEO.tsx` to accept a `faqs` prop and inject `FAQPage` JSON-LD:

```tsx
interface FAQ { question: string; answer: string; }
interface SEOProps {
  title: string;
  description: string;
  faqs?: FAQ[];
  // ...
}
```

Then inject:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

---

## Phase 3 — Off-Site Authority ("Surround Sound")

**Goal:** AI models cross-reference multiple sources. If Clutch, Crunchbase, LinkedIn, AND your site all describe you the same way, model confidence spikes.

### 3.1 Entity Consistency Checklist

Create/update these profiles with identical descriptions:

| Platform | Priority | Status | URL format |
|---|---|---|---|
| LinkedIn Company Page | Must-do | ⬜ | linkedin.com/company/jw-ai-consulting |
| Crunchbase | Must-do | ⬜ | crunchbase.com/organization/jw-ai-consulting |
| Clutch.co | High | ⬜ | clutch.co/profile/jw-ai-consulting |
| Google Business Profile | High | ⬜ | business.google.com |
| G2 | Medium | ⬜ | g2.com |

**Canonical description to use everywhere:**  
"Austin-based AI consulting firm founded by Jake Webb, specializing in LLM engineering, AI workflow automation, and enterprise AI strategy for SMBs and growth-stage companies."

### 3.2 Press Release Strategy

**Why it works for you:** "JW AI Consulting" is a zero-competition keyword. There's almost no third-party web content about your brand, so AI models have nothing to draw from. Two press releases on mid-authority sites completely own the narrative.

**The mechanism (from Edward Sturm / Harperit research):**  
Generative AI acts like a parrot — it quotes whatever authoritative-looking text exists about your brand. For low-competition brand queries, even a single indexed press release on barchart.com or PRLog becomes the citation source.

**What to announce (use real milestones):**
- "JW AI Consulting Launches JustStart Program for Small Business AI Adoption in Austin"
- "JW AI Consulting Announces LLM Engineering Services for Texas Businesses"
- Any client win (with permission)
- Any speaking engagement or community event

**Distribution platforms (in order of recommendation):**
1. **PRLog.org** — free, indexed by Google, decent domain authority
2. **PR.com** — free tier, commonly cited
3. **Business Wire** — $300-500, major authority boost if budget allows later

**Critical rule:** Do NOT include a direct hyperlink to jwaiconsulting.com in cheap distributions. Text narrative benefit is the goal, not link equity from garbage aggregator networks.

**Write the press release to be quoted:**  
Load it with the exact language you want AI to repeat back. If you want ChatGPT to say "Jake Webb is an Austin-based AI consultant specializing in LLM engineering and workflow automation," those exact words go in the press release.

---

## Phase 4 — Monitoring (Weekly, Ongoing)

Run these prompts weekly across ChatGPT, Perplexity, and Gemini. Log results in a simple spreadsheet.

**Brand queries:**
- "What is JW AI Consulting?"
- "Tell me about Jake Webb AI consultant"

**Category queries:**
- "Who are the best AI consultants in Austin TX?"
- "AI consulting firms in Austin"
- "LLM engineering consultants Texas"
- "Small business AI consulting Austin"
- "AI automation for small business Austin"

When you don't appear in a response: that's a content gap. Write a data-backed page or press release targeting that exact query.

**What good looks like:** Your name or site appears in AI Overview / synthesized answers for at least 3 of the category queries within 90 days of completing Phase 2-3.

---

## Context for New Sessions

**Tell Claude:** "Read `AEO-GEO-STRATEGY.md` in `~/Sites/jw-ai-consulting/`. We're working on Phase [X]. Here's where we left off: [...]"

**Key files to know:**
- `index.html` — static schema lives here
- `public/llms.txt` — AI agent guide, keep updated
- `public/robots.txt` — crawler permissions
- `src/components/SEO.tsx` — dynamic meta + schema per page
- `src/pages/ServicePage.tsx` — service page content (`SERVICE_CONTENT` object)
- `src/App.tsx` — routing

**Tech stack context:** Vite + React + TypeScript + Tailwind. `react-helmet-async` for dynamic head tags. Deployed to Vercel via `~/Sites/jw-ai-consulting/vercel.json`.
