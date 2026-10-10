# Personal portfolio

A one-page, responsive portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. It includes project and credential sections backed by editable static data, plus server-side GitHub and LeetCode analytics endpoints.

## Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set your profile usernames. Add `GITHUB_TOKEN` for GitHub GraphQL analytics; keep it server-only and never prefix it with `NEXT_PUBLIC_`.
3. Run `npm run dev` and open the local URL shown in the terminal.

## Personalize the site

- Edit `src/data/portfolio.ts` to set your name, location, email, profile links, usernames, projects, and certifications.
- Add your actual resume as `public/resume.pdf`, or update the resume links in the data file.
- Each project should include a concise description, stack, repository URL, and optional demo URL. Each certification should link to a verification page.
- The starter has no invented project or certification claims. Empty states explain how to add evidence.

## Analytics

- `GET /api/github` uses GitHub GraphQL server-side. Set `GITHUB_USERNAME` and a read-only `GITHUB_TOKEN`; the token is never sent to the browser. Returned public profile data is cached for one hour.
- `GET /api/leetcode` calls LeetCode's GraphQL endpoint server-side using `LEETCODE_USERNAME` and caches the result for one hour. Its best recent accepted-submission streak is calculated from the latest 20 public accepted submissions, so it is not an all-time record. LeetCode's endpoint is unofficial and can change or rate-limit; the interface degrades gracefully if the service is unavailable.
- The homepage snapshot and detailed analytics panels both use these endpoints. Metrics display as unavailable until configured rather than making up numbers.

For Vercel deployment, import the GitHub repository, add the same server-side environment variables in Project Settings, and deploy. Never commit `.env.local` or a token.

## Checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

--
