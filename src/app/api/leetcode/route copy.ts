import { NextResponse } from "next/server";
import { portfolio } from "@/data/portfolio";

export const revalidate = 3600;

const leetcodeQuery = `
  query PortfolioStats($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      badges {
        id
        displayName
        icon
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      rating
      ranking
      contest {
        title
        startTime
      }
    }
    userProfileUserQuestionProgressV2(userSlug: $username) {
      numAcceptedQuestions {
        count
        difficulty
      }
      numFailedQuestions {
        count
        difficulty
      }
      numUntouchedQuestions {
        count
        difficulty
      }
      userSessionBeatsPercentage {
        difficulty
        percentage
      }
      totalQuestionBeatsPercentage
    }
  }
`;

export async function GET() {
  const username = process.env.LEETCODE_USERNAME ?? portfolio.leetcodeUsername;

  if (!username || username === "your-username") {
    return NextResponse.json({
      configured: false,
      data: null,
      message: "Add your LeetCode username to enable analytics.",
    });
  }

  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Referer": `https://leetcode.com/u/${username}/`,
        "Origin": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query: leetcodeQuery,
        variables: { username },
        operationName: "PortfolioStats",
      }),
      next: { revalidate: 3600 },
    });

    const raw = await response.text();
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("application/json")) {
      console.log("LeetCode status:", response.status);
      console.log("LeetCode content-type:", contentType);
      console.log("LeetCode raw body:", raw.slice(0, 1000));

      return NextResponse.json(
        {
          configured: true,
          data: null,
          message: "LeetCode analytics are temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const payload = JSON.parse(raw);

    if (payload.errors?.length) {
      console.log("LeetCode GraphQL errors:", payload.errors);
      return NextResponse.json(
        {
          configured: true,
          data: null,
          message: payload.errors[0]?.message ?? "Could not load this LeetCode profile.",
        },
        { status: 502 }
      );
    }

    const user = payload.data?.matchedUser;
    const counts = user?.submitStats?.acSubmissionNum ?? [];

    return NextResponse.json(
      {
        configured: true,
        data: {
          username,
          solved: counts.find((item: any) => item.difficulty === "All")?.count ?? 0,
          easy: counts.find((item: any) => item.difficulty === "Easy")?.count ?? 0,
          medium: counts.find((item: any) => item.difficulty === "Medium")?.count ?? 0,
          hard: counts.find((item: any) => item.difficulty === "Hard")?.count ?? 0,
          rating: Math.round(payload.data?.userContestRanking?.rating ?? 0),
          contests: payload.data?.userContestRanking?.attendedContestsCount ?? 0,
          badges: (user?.badges ?? []).slice(0, 3),
        },
        updatedAt: new Date().toISOString(),
      },
      {
        headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
      }
    );
  } catch (err) {
    console.error("LeetCode API Error:", err);
    return NextResponse.json(
      {
        configured: true,
        data: null,
        message: "LeetCode analytics are temporarily unavailable.",
      },
      { status: 502 }
    );
  }
}
