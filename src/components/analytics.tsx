"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, GitBranch, Github, RefreshCw, Trophy } from "lucide-react";
import { portfolio } from "@/data/portfolio";

type GitHubData = {
  username: string;
  repositories: number;
  followers: number;
  contributions: number;
  streak: number;
  languages: { name: string; count: number }[];
  topRepositories: { name: string; stars: number; language: string; url: string }[];
};

type LeetCodeData = {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating: number | null;
  contests: number;
  bestRecentStreak: number;
  activeDays: number;
  badges: { id: string; displayName: string; icon: string }[];
};

type ApiResult<T> = { configured: boolean; data: T | null; message?: string; updatedAt?: string };

export function Analytics() {
  const [github, setGithub] = useState<ApiResult<GitHubData> | null>(null);
  const [leetcode, setLeetcode] = useState<ApiResult<LeetCodeData> | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfiles() {
    const [githubResponse, leetcodeResponse] = await Promise.allSettled([
      fetch("/api/github", { cache: "no-store" }).then((response) => response.json() as Promise<ApiResult<GitHubData>>),
      fetch("/api/leetcode", { cache: "no-store" }).then((response) => response.json() as Promise<ApiResult<LeetCodeData>>),
    ]);
    return {
      github: githubResponse.status === "fulfilled" ? githubResponse.value : null,
      leetcode: leetcodeResponse.status === "fulfilled" ? leetcodeResponse.value : null,
    };
  }

  async function load() {
    setLoading(true);
    const results = await fetchProfiles();
    setGithub(results.github);
    setLeetcode(results.leetcode);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    void fetchProfiles().then((results) => {
      if (!active) return;
      setGithub(results.github);
      setLeetcode(results.leetcode);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const githubName = github?.data?.username ?? portfolio.githubUsername;
  const leetcodeName = leetcode?.data?.username ?? portfolio.leetcodeUsername;
  const solved = leetcode?.data?.solved;

  return (
    <>
      <div className="analytics-grid">
        <article className="analytics-card" id="leetcode-card">
          <div className="analytics-card-head">
            <div className="analytics-brand"><span className="brand-icon leetcode-icon"><CodeMark /></span><div><span className="eyebrow">01 / Practice</span><h3>LeetCode</h3></div></div>
            {leetcode?.data && <a className="icon-link" href={`https://leetcode.com/u/${encodeURIComponent(leetcodeName)}/`} target="_blank" rel="noreferrer" aria-label="Open LeetCode profile"><ArrowUpRight size={18} /></a>}
          </div>
          {loading ? <div className="data-state"><span className="loader" /> Syncing public profile…</div> : leetcode?.data ? (
            <>
              <div className="lc-total"><strong>{leetcode.data.solved}</strong><span>problems solved</span>{leetcode.data.rating !== null && <div className="lc-rating"><Trophy size={15} /> {leetcode.data.rating} rating</div>}</div>
              <div className="difficulty-list">
                <Difficulty label="Easy" value={leetcode.data.easy} total={leetcode.data.solved} color="var(--accent)" />
                <Difficulty label="Medium" value={leetcode.data.medium} total={leetcode.data.solved} color="var(--amber)" />
                <Difficulty label="Hard" value={leetcode.data.hard} total={leetcode.data.solved} color="var(--coral)" />
              </div>
              {leetcode.data.badges.length > 0 && <div className="badge-row">{leetcode.data.badges.map((badge) => <span key={badge.id}><Trophy size={11} /> {badge.displayName}</span>)}</div>}
              <div className="analytics-foot"><span title="Longest consecutive-day run found in the latest 20 accepted submissions returned by LeetCode. This is not an all-time record."><Flame size={15} /> Best recent: {leetcode.data.bestRecentStreak} day streak</span><span>{leetcode.data.activeDays} active days{leetcode.data.contests > 0 && ` · ${leetcode.data.contests} contests`}</span></div>
            </>
          ) : <SetupState message={leetcode?.message ?? "Live stats will appear here once configured."} href={`https://leetcode.com/u/${encodeURIComponent(leetcodeName)}/`} />}
        </article>

        <article className="analytics-card" id="github-card">
          <div className="analytics-card-head">
            <div className="analytics-brand"><span className="brand-icon github-icon"><Github size={19} /></span><div><span className="eyebrow">02 / In the open</span><h3>GitHub</h3></div></div>
            {github?.data && <a className="icon-link" href={`https://github.com/${encodeURIComponent(githubName)}`} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ArrowUpRight size={18} /></a>}
          </div>
          {loading ? <div className="data-state"><span className="loader" /> Syncing public profile…</div> : github?.data ? (
            <>
              <div className="github-stats"><Stat value={github.data.repositories} label="repositories" /><Stat value={github.data.followers} label="followers" /><Stat value={github.data.contributions} label="contributions / yr" /></div>
              <div className="language-row"><span className="micro-label">TOP LANGUAGES</span><div className="language-tags">{github.data.languages.slice(0, 4).map((language) => <span key={language.name}>{language.name}</span>)}</div></div>
              {github.data.topRepositories.length > 0 && <div className="repo-row">{github.data.topRepositories.slice(0, 3).map((repo) => <a href={repo.url} target="_blank" rel="noreferrer" key={repo.name}>{repo.name}<span>★ {repo.stars}</span></a>)}</div>}
              <div className="analytics-foot"><span><GitBranch size={15} /> {github.data.streak} day contribution streak</span></div>
            </>
          ) : <SetupState message={github?.message ?? "Live stats will appear here once configured."} href={`https://github.com/${encodeURIComponent(githubName)}`} />}
        </article>
      </div>
      <div className="sync-note"><span>Public profile data · refreshed hourly</span><button type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh</button></div>
      {solved !== undefined && <span className="sr-only">{solved} LeetCode problems solved</span>}
    </>
  );
}

function Difficulty({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const width = total ? `${Math.min(100, (value / total) * 100)}%` : "0%";
  return <div className="difficulty"><div className="difficulty-meta"><span>{label}</span><span>{value}</span></div><div className="difficulty-track"><span style={{ width, backgroundColor: color }} /></div></div>;
}

function Stat({ value, label }: { value: number; label: string }) {
  return <div className="github-stat"><strong>{value.toLocaleString()}</strong><span>{label}</span></div>;
}

function SetupState({ message, href }: { message: string; href: string }) {
  return <div className="analytics-empty"><p>{message}</p><a href={href} target="_blank" rel="noreferrer">View profile <ArrowUpRight size={14} /></a></div>;
}

function CodeMark() {
  return <span className="code-mark">&lt;/&gt;</span>;
}
