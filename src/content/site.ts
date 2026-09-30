// Single source of site copy. Every fact here must trace to content/profile.md.

export const person = {
  name: "David Centeno Pedrido",
  shortName: "David Centeno",
  role: "Senior Data Professional",
  location: "A Coruña, Spain",
  timeZone: "Europe/Madrid",
  email: "dcentenopedrido@gmail.com",
  linkedin: "https://www.linkedin.com/in/david-centeno-pedrido/",
  headline: "Analytics engineering, machine learning and product analytics, end to end.",
  summary:
    "Senior data professional with 10+ years across analytics, data science and analytics engineering. I work end-to-end: from raw data and the models on top of it, to the room where the decision gets made.",
} as const;

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  paragraphs: [
    "I've built production ML systems, designed analytics platforms from scratch, and partnered closely with product, commercial and leadership teams to turn data into decisions people actually trust.",
    "My foundations are mathematical (a BSc in Mathematics and two years teaching statistics at master's level), but my work is practical: the dbt model, the metric definition everyone agrees on, the dashboard that replaces a weekly spreadsheet, the model that ships inside the product.",
    "Lately I've been focused on modern analytics stacks and applied AI, building and shipping my own LLM-powered products. I do my best work as a senior IC with real ownership, and I step up to lead when the team needs it.",
  ],
  facts: [
    { value: "10+", label: "years in data" },
    { value: "2×", label: "promoted into leadership" },
    { value: "2", label: "live LLM products" },
    { value: "BSc", label: "Mathematics" },
  ],
  languages: ["Spanish · native", "Galician · native", "English · C1"],
} as const;

export type Role = {
  company: string;
  domain: string;
  period: string;
  path: string[];
  summary: string;
  built: { title: string; detail: string }[];
  impact: string[];
  stack: string[];
  featured?: boolean;
};

export const roles: Role[] = [
  {
    company: "Roadsurfer",
    domain: "Campervan & RV rental subscription platform",
    period: "2024–2026",
    path: ["Senior Data Analyst"],
    summary:
      "Senior IC across Customer Support, Sales and the Subscription product at a multi-country mobility scaleup, owning analytics projects from ingestion through transformation, modeling and visualization.",
    built: [
      { title: "Analytics engineering layer", detail: "dbt models turning raw operational and product data into analysis-ready tables." },
      { title: "Business & product analytics", detail: "Dashboards and reporting for Support, Sales and Subscription teams." },
      { title: "End-to-end pipelines", detail: "Consistency and reliability across every layer, ingestion to visualization." },
    ],
    impact: [
      "Consistent, trusted metrics for subscriptions, customer support and sales.",
      "Stakeholders self-serving key insights instead of relying on manual reporting.",
    ],
    stack: ["dbt", "SQL", "BigQuery", "Metabase", "Python"],
  },
  {
    company: "Gelato",
    domain: "Global B2B print-on-demand & e-commerce platform",
    period: "2022–2024",
    path: ["Senior Data Analyst", "Lead Data Analyst", "Interim Head of Data"],
    summary:
      "End-to-end analytics for Sales, Finance, Marketing and Customer Success. Led a team of two analysts, then ran the whole data function (analysts, data engineers and data scientists) for four months as Interim Head of Data.",
    built: [
      { title: "Commercial analytics stack", detail: "LookML and dbt models on BigQuery powering Looker for revenue, pricing and customer behavior." },
      { title: "Customer segmentation ML", detail: "Interpretable tree-based models to classify the customer base into meaningful segments." },
      { title: "Pricing recommendations", detail: "Data-driven retail price recommendations supporting B2B pricing decisions." },
      { title: "Platform performance", detail: "BigQuery query and data-structure optimization for speed and cost." },
    ],
    impact: [
      "Pricing and customer-targeting decisions made on consistent, trusted metrics.",
      "Leadership visibility into segments, revenue drivers and commercial performance.",
      "Kept the data function delivering through a leadership gap.",
    ],
    stack: ["BigQuery", "dbt", "LookML", "Looker", "Amplitude", "Python"],
    featured: true,
  },
  {
    company: "Barkibu",
    domain: "Pet health insurance & AI-driven veterinary platform",
    period: "2019–2022",
    path: ["Data Scientist, AI", "Head of Analytics"],
    summary:
      "Built ML that shipped inside the core veterinary product, then took ownership of analytics company-wide, defining the KPIs and building the company's first central data platform.",
    built: [
      { title: "Veterinary AI", detail: "Deep-learning model predicting likely diseases from symptoms, in production for automated triage." },
      { title: "LTV & churn library", detail: "R library computing customer value and churn predictions for a large pet retailer." },
      { title: "First data platform", detail: "Data lake designed from scratch, ETL pipelines and self-serve dashboards." },
    ],
    impact: [
      "ML models running directly in the company's core product.",
      "A single source of truth for KPIs, for the first time.",
      "Analytics scaled from ad-hoc reporting to a company-wide platform.",
    ],
    stack: ["Python", "Keras", "R", "AWS S3", "AWS Glue", "Stitch", "Tableau"],
    featured: true,
  },
];

export const teaching = {
  institution: "VIU · Universidad Internacional de Valencia",
  role: "Professor",
  period: "2018–2020",
  subjects: [
    { name: "Statistical Methods for the Analysis and Interpretation of Massive Data", program: "MSc Data Science & Big Data · MSc Internet of Things" },
    { name: "Mathematics I", program: "BSc Industrial Organization" },
  ],
};

export const earlier = [
  { company: "R Cable y Telecomunicaciones Galicia", role: "Data Scientist, AI", period: "2017–2019", note: "R&D analytics and models for new telecom products. R, Python, Elasticsearch." },
  { company: "NorConsulting (Vector ITC)", role: "Data Scientist", period: "2016–2017", note: "Statistical models in R; KPI datamarts on Oracle SQL and IBM DB2; taught an intro R course." },
  { company: "OpenSistemas", role: "Developer / Data Scientist", period: "2016", note: "Forex strategy research and evaluation in Python with Pandas and NumPy." },
  { company: "CO2 SmartTech", role: "Data Scientist", period: "2015–2016", note: "Energy-consumption regression and forecasting in R, integrated into a client tool." },
];

export type ArchNode = { id: string; label: string; sub: string; x: number; y: number };
export type Project = {
  slug: string;
  name: string;
  url: string;
  urlLabel: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  screens: { desktop: string; secondary: string; mobile: string; alt: string };
  accent: string;
  arch: { nodes: ArchNode[]; edges: [string, string, string?][] };
};

export const projects: Project[] = [
  {
    slug: "resumatch",
    name: "ResuMatch",
    url: "https://www.tryresumatch.app/",
    urlLabel: "tryresumatch.app",
    tagline: "Tailor a CV to any job without inventing a single fact.",
    description:
      "Upload a CV, paste a job advert, get back a tailored Word document plus an honest strengths / weaknesses / gaps analysis. The hard rule: the model may select, reorder and rephrase, but never invent employers, titles, dates, numbers or skills.",
    highlights: [
      "Claude with structured output via forced tool calls, no free-text JSON parsing",
      "Grounding spot-check that flags any company or title not in the source CV",
      "Freemium model: anonymous daily quota, accounts, Stripe credit packs with idempotent webhooks",
      "Hostile-upload handling, per-IP rate limits and Cloudflare Turnstile",
      "Per-locale DOCX templates and a hand-rolled English / Spanish UI",
    ],
    stack: ["Next.js", "TypeScript", "Claude API", "Supabase", "Stripe", "Tailwind", "Vercel"],
    screens: {
      desktop: "/images/resumatch-landing.webp",
      secondary: "/images/resumatch-how.webp",
      mobile: "/images/resumatch-mobile.webp",
      alt: "ResuMatch landing page showing an original CV next to its tailored version with strengths, weaknesses and gaps",
    },
    accent: "#2FBF7F",
    arch: {
      nodes: [
        { id: "user", label: "Browser", sub: "CV + job advert", x: 72, y: 162 },
        { id: "api", label: "Next.js routes", sub: "Vercel · Node", x: 260, y: 162 },
        { id: "claude", label: "Claude", sub: "forced tool calls", x: 446, y: 48 },
        { id: "docx", label: "DOCX render", sub: "docxtemplater", x: 446, y: 162 },
        { id: "db", label: "Supabase", sub: "Postgres · Auth · Storage", x: 446, y: 276 },
        { id: "stripe", label: "Stripe", sub: "checkout → webhook", x: 260, y: 276 },
      ],
      edges: [
        ["user", "api", "upload"],
        ["api", "claude", "parse · tailor"],
        ["api", "docx"],
        ["api", "db"],
        ["stripe", "db", "credits"],
        ["user", "stripe"],
      ],
    },
  },
  {
    slug: "undictionary",
    name: "UnDictionary",
    url: "https://undictionarygame.com/",
    urlLabel: "undictionarygame.com",
    tagline: "A word game where an LLM judges meaning, not wording.",
    description:
      "Guess every definition of a word. Your answer doesn't need to match the dictionary; it needs to mean the same thing. An LLM acts as a semantic judge rather than a text generator, deciding whether each guess matches a valid definition.",
    highlights: [
      "LLM-as-judge: prompts and evaluation logic that compare meaning against multiple valid definitions",
      "Casual, Challenge (race the clock) and Daily Challenge modes, with hints and scoring",
      "Event tracking to study drop-off, difficulty and which definitions are hardest to guess",
      "Grew from a single Python script into a full product, with a frontend built with AI-assisted tooling",
    ],
    stack: ["Python", "FastAPI", "LLM API", "JavaScript", "Google Analytics", "Railway", "Vercel"],
    screens: {
      desktop: "/images/undictionary-game.webp",
      secondary: "/images/undictionary-welcome.webp",
      mobile: "/images/undictionary-mobile.webp",
      alt: "UnDictionary game round: a word, its difficulty, and hidden meanings for the player to describe in their own words",
    },
    accent: "#E0546F",
    arch: {
      nodes: [
        { id: "user", label: "Browser", sub: "vanilla JS · Vercel", x: 72, y: 162 },
        { id: "api", label: "FastAPI", sub: "Python · Railway", x: 260, y: 162 },
        { id: "llm", label: "LLM judge", sub: "meaning ≈ definition?", x: 446, y: 62 },
        { id: "dict", label: "Dictionary", sub: "words · definitions", x: 446, y: 262 },
        { id: "ga", label: "Analytics", sub: "custom GA events", x: 260, y: 276 },
      ],
      edges: [
        ["user", "api", "guess"],
        ["api", "llm", "judge"],
        ["api", "dict"],
        ["user", "ga", "events"],
      ],
    },
  },
];

export const skills = [
  { domain: "analytics_engineering", tools: ["dbt", "SQL", "BigQuery", "LookML", "Data modeling", "Metrics layers", "ETL", "AWS S3 / Glue", "Stitch"] },
  { domain: "machine_learning", tools: ["Python", "R", "Keras", "Tree-based models", "LTV & churn", "Forecasting", "Pricing", "Statistics"] },
  { domain: "bi_and_product", tools: ["Looker", "Metabase", "Tableau", "Amplitude", "Google Analytics"] },
  { domain: "applied_ai", tools: ["Claude API", "OpenAI API", "Structured outputs", "LLM-as-judge", "AI-assisted dev"] },
  { domain: "leadership", tools: ["Stakeholder ownership", "Prioritization", "Mentoring", "Interim function lead", "Teaching"] },
] as const;

export const education = {
  degree: "BSc Mathematics",
  institution: "University of Santiago de Compostela",
  period: "2009–2015",
};
