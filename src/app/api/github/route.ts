import { NextResponse } from "next/server";
import { portfolio } from "@/data/portfolio";

export const revalidate = 3600;

const githubQuery = `
  query PortfolioOverview($login: String!) {
    user(login: $login) {
      login
      name
      followers { totalCount }
      repositories(ownerAffiliations: OWNER, first: 100, privacy: PUBLIC, orderBy: { field: UPDATED_AT, direction: DESC }) {
        totalCount
        nodes {
          name
          stargazerCount
          primaryLanguage { name }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const username = process.env.GITHUB_USERNAME ?? portfolio.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  if (!token || username === "your-username") {
    return NextResponse.json({ configured: false, data: null, message: "Add your GitHub username and token to enable analytics." });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: githubQuery, variables: { login: username } }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ configured: true, data: null, message: "GitHub analytics are temporarily unavailable." }, { status: 502 });
    }

    const payload = await response.json();
    const user = payload.data?.user;
    if (!user || payload.errors?.length) {
      return NextResponse.json({ configured: true, data: null, message: "Could not load this GitHub profile." }, { status: 502 });
    }

    const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week: { contributionDays: { date: string; contributionCount: number }[] }) => week.contributionDays,
    );
    const languages = user.repositories.nodes.reduce(
      (counts: Record<string, number>, repo: { primaryLanguage: { name: string } | null }) => {
        if (repo.primaryLanguage) counts[repo.primaryLanguage.name] = (counts[repo.primaryLanguage.name] ?? 0) + 1;
        return counts;
      },
      {},
    );

    return NextResponse.json({
      configured: true,
      data: {
        username,
        repositories: user.repositories.totalCount,
        followers: user.followers.totalCount,
        contributions: user.contributionsCollection.contributionCalendar.totalContributions,
        streak: currentStreak(days),
        languages: Object.keys(languages)
          .map((name) => ({ name, count: languages[name] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        topRepositories: user.repositories.nodes.slice(0, 4).map((repo: { name: string; stargazerCount: number; primaryLanguage: { name: string } | null }) => ({
          name: repo.name,
          stars: repo.stargazerCount,
          language: repo.primaryLanguage?.name ?? "",
          url: `https://github.com/${username}/${repo.name}`,
        })),
      },
      updatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ configured: true, data: null, message: "GitHub analytics are temporarily unavailable." }, { status: 502 });
  }
}

function currentStreak(days: { date: string; contributionCount: number }[]) {
  let streak = 0;
  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  const today = day.toISOString().slice(0, 10);
  if (!days.find((entry) => entry.date === today)?.contributionCount) {
    day.setTime(day.getTime() - 86_400_000);
  }
  while (days.find((entry) => entry.date === day.toISOString().slice(0, 10))?.contributionCount) {
    streak += 1;
    day.setTime(day.getTime() - 86_400_000);
  }
  return streak;
}
