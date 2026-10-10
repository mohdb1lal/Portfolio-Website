import { NextResponse } from "next/server";
import { portfolio } from "@/data/portfolio";

export const revalidate = 3600;

const leetcodeQuery = `
  query PortfolioStats($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
      badges { id displayName icon }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    recentAcSubmissionList(username: $username, limit: 20) {
      timestamp
    }
  }
`;

export async function GET() {
  const username = process.env.LEETCODE_USERNAME ?? portfolio.leetcodeUsername;
  if (!username || username === "your-username") {
    return NextResponse.json({ configured: false, data: null, message: "Add your LeetCode username to enable analytics." });
  }

  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PortfolioAnalytics/1.0",
      },
      body: JSON.stringify({ query: leetcodeQuery, variables: { username } }),
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return NextResponse.json({ configured: true, data: null, message: "LeetCode analytics are temporarily unavailable." }, { status: 502 });
    }

    const payload = await response.json();
    const user = payload.data?.matchedUser;
    if (!user || payload.errors?.length) {
      return NextResponse.json({ configured: true, data: null, message: "Could not load this LeetCode profile." }, { status: 502 });
    }

    const counts = user.submitStats.acSubmissionNum as { difficulty: string; count: number }[];
    const recentSubmissions = payload.data.recentAcSubmissionList as { timestamp: string }[] | undefined;
    if (!Array.isArray(recentSubmissions)) {
      return NextResponse.json({ configured: true, data: null, message: "Could not load LeetCode submission history." }, { status: 502 });
    }

    const calendarText = user.userCalendar?.submissionCalendar;
    let activeDays = 0;
    if (calendarText) {
      try {
        activeDays = Object.keys(JSON.parse(calendarText) as Record<string, number>).length;
      } catch {
        activeDays = 0;
      }
    }

    return NextResponse.json({
      configured: true,
      data: {
        username,
        solved: counts.find((item) => item.difficulty === "All")?.count ?? 0,
        easy: counts.find((item) => item.difficulty === "Easy")?.count ?? 0,
        medium: counts.find((item) => item.difficulty === "Medium")?.count ?? 0,
        hard: counts.find((item) => item.difficulty === "Hard")?.count ?? 0,
        rating: payload.data.userContestRanking?.rating == null
          ? null
          : Math.round(payload.data.userContestRanking.rating),
        contests: payload.data.userContestRanking?.attendedContestsCount ?? 0,
        bestRecentStreak: getBestAcceptedStreak(recentSubmissions),
        activeDays,
        badges: (user.badges as { id: string; displayName: string; icon: string }[]).slice(0, 3),
      },
      updatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
  } catch(err) {
    console.error("LeetCode API Error:", err);
    return NextResponse.json({error:"check log", configured: true, data: null, message: "LeetCode analytics are temporarily unavailable." }, { status: 502 });
  }
}

function getBestAcceptedStreak(submissions: { timestamp: string }[]) {
  const days = [...new Set(submissions
    .map(({ timestamp }) => Math.floor(Number(timestamp) / 86_400))
    .filter(Number.isFinite))]
    .sort((a, b) => a - b);

  let bestStreak = 0;
  let currentStreak = 0;
  let previousDay: number | undefined;

  for (const day of days) {
    currentStreak = previousDay !== undefined && day === previousDay + 1 ? currentStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    previousDay = day;
  }

  return bestStreak;
}
