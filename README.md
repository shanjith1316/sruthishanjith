# Sruthi ❤️ Shanjith

A tiny romantic web app: PIN-gated login → sidebar with **Our Events** (Supabase-backed memory board) and **Quiz** (5 questions + a playful proposal at the end).

## Tech
React 18, React Router 6, Vite, Tailwind CSS, Supabase (Postgres + Storage), canvas-confetti.

## Folder structure

```
SruthiShanjith/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── supabase/
│   └── schema.sql
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   └── supabaseClient.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── ProtectedLayout.jsx
    │   └── Proposal.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Events.jsx
    │   └── Quiz.jsx
    └── data/
        └── quizQuestions.js
```

## Setup

1. Install deps:
   ```bash
   npm install
   ```

2. Copy env template and fill it in:
   ```bash
   cp .env.example .env
   ```
   Set:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — the anon public key
   - `VITE_APP_PIN` — the 4-digit PIN she'll enter (defaults to `0808`)

3. In Supabase, open the SQL editor and run `supabase/schema.sql`. That creates:
   - `public.events` table (`id`, `title`, `event_date`, `description`, `image_url`, `created_at`)
   - `event-images` public storage bucket
   - Permissive RLS policies so the anon key can read/insert (personal-use setup — lock down with auth if you deploy publicly)

4. Run it:
   ```bash
   npm run dev
   ```

## Customize before showing her
- `src/data/quizQuestions.js` — replace with your real inside-joke questions and swap the image URL for a real photo (upload to the `event-images` bucket and use the public URL).
- `.env` → `VITE_APP_PIN` — set it to a date only you two know (birthday, anniversary…).
- `src/components/Proposal.jsx` — tweak the sweet message after "She said yes!".

## Notes
- The **No** button dodges on hover / focus / touch, and gets sassier each dodge.
- The **Yes** button fires a confetti cascade.
- Login state lives in `sessionStorage` (clears on tab close).
