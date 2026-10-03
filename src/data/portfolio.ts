export type Project = {
  name: string;
  description: string;
  stack: string[];
  repositoryUrl: string;
  demoUrl?: string;
  featured?: boolean;
};

export type Certification = {
  name: string;
  issuer: string;
  issued: string;
  verificationUrl: string;
};

/** Replace the sample profile values and add your verified work here. */
export const portfolio: {
  name: string;
  role: string;
  location: string;
  availability: string;
  intro: string;
  email: string;
  githubUsername: string;
  leetcodeUsername: string;
  links: { github: string; linkedin: string; resume: string };
  focus: string[];
  projects: Project[];
  certifications: Certification[];
} = {
  name: "Mohammad Bilal",
  role: "Software Engineer",
  location: "Chennai, Tamil Nadu",
  availability: "Open to opportunities",
  intro:
    "I build thoughtful software, from reliable cloud services to polished interfaces. I care about the details, the systems behind the screen, and shipping work that solves real problems.",
  email: "hello@example.com",
  githubUsername: "mohdb1lal",
  leetcodeUsername: "btechfolks",
  links: {
    github: "https://github.com/mohdb1lal",
    linkedin: "https://in.linkedin.com/in/mohdb1lal",
    resume: "/resume.pdf",
  },
  focus: ["Python", "AWS", "TypeScript", "Full Stack Development"],
  projects: [] satisfies Project[],
  certifications: [] satisfies Certification[],
};
