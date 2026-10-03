"use client";

import { useEffect, useState } from "react";
import { Award, BriefcaseBusiness, Code2, Github } from "lucide-react";
import { portfolio } from "@/data/portfolio";

type Counts = { leetcode: number | null; github: number | null };

export function Snapshot() {
  const [counts, setCounts] = useState<Counts>({ leetcode: null, github: null });

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      fetch("/api/leetcode").then((response) => response.json()),
      fetch("/api/github").then((response) => response.json()),
    ]).then(([leetcode, github]) => {
      if (!active) return;
      setCounts({
        leetcode: leetcode.status === "fulfilled" ? leetcode.value.data?.solved ?? null : null,
        github: github.status === "fulfilled" ? github.value.data?.repositories ?? null : null,
      });
    });
    return () => { active = false; };
  }, []);

  const metrics = [
    { icon: <Code2 size={18} />, value: counts.leetcode?.toLocaleString() ?? "—", label: "LeetCode solved", detail: "problems", href: "#activity" },
    { icon: <Github size={18} />, value: counts.github?.toLocaleString() ?? "—", label: "GitHub projects", detail: "public repos", href: "#activity" },
    { icon: <Award size={18} />, value: String(portfolio.certifications.length).padStart(2, "0"), label: "Certifications", detail: "verified credentials", href: "#certifications" },
    { icon: <BriefcaseBusiness size={18} />, value: String(portfolio.projects.length).padStart(2, "0"), label: "Featured projects", detail: "built & shipped", href: "#projects" },
  ];

  return <div className="metric-grid">{metrics.map((metric) => <a className="metric-card" href={metric.href} key={metric.label}><span className="metric-icon">{metric.icon}</span><strong>{metric.value}</strong><span className="metric-label">{metric.label}</span><span className="metric-detail">{metric.detail}</span></a>)}</div>;
}
