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
    }
    // userContestRanking(username: $username) {
    //   attendedContestsCount
    //   rating
    //   globalRanking
    //   topPercentage
    // }
    // userCalendar(username: $username) {
    //   streak
    //   totalActiveDays
    //   submissionCalendar
    // }
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
      return NextResponse.json({response:response, configured: true, data: null, message: "LeetCode analytics are temporarily unavailable." }, { status: 502 });
    }

    const payload = await response.json();
    const user = payload.data?.matchedUser;
    if (!user || payload.errors?.length) {
      return NextResponse.json({ configured: true, data: null, message: "Could not load this LeetCode profile." }, { status: 502 });
    }

    const counts = user.submitStats.acSubmissionNum as { difficulty: string; count: number }[];
    const calendarText = payload.data.userCalendar?.submissionCalendar;
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
        rating: Math.round(payload.data.userContestRanking?.rating ?? 0),
        contests: payload.data.userContestRanking?.attendedContestsCount ?? 0,
        streak: payload.data.userCalendar?.streak ?? 0,
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
