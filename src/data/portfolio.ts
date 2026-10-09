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
  role: "Backend Engineer",
  location: "Chennai, Tamil Nadu",
  availability: "Open to opportunities",
  intro:
    "I build thoughtful software, from reliable cloud services to polished interfaces. I care about the details, the systems behind the screen, and shipping work that solves real problems.",
  email: "btechfolks@gmail.com",
  githubUsername: "mohdb1lal",
  leetcodeUsername: "btechfolks",
  links: {
    github: "https://github.com/mohdb1lal",
    linkedin: "https://in.linkedin.com/in/mohdb1lal",
    resume: "/resume.pdf",
  },
  focus: ["Python", "AWS", "TypeScript", "Full Stack Development"],
  projects: [
    {
      name: "Autonomous Lane & Object Detection",
      description:
        "Computer vision pipeline built using OpenCV and YOLOv4 to detect vehicles and map road lanes in real time for autonomous driving concepts.",
      stack: ["Python", "OpenCV", "YOLOv4", "Machine Learning"],
      repositoryUrl: "https://github.com/mohdb1lal",
      featured: true,
    },
    {
      name: "Full-Stack E-Commerce Book Platform",
      description:
        "Web application featuring user authentication, inventory management, and persistent book catalog storage using Flask and MongoDB.",
      stack: ["Python", "Flask", "MongoDB", "HTML/CSS"],
      repositoryUrl: "https://github.com/mohdb1lal",
      featured: false
    },
    {
      name: "Raspberry Pi Assistant Robot",
      description:
        "IoT-enabled hardware project running on Raspberry Pi capable of alarm scheduling, note-taking, IoT device control, and basic emotion displays.",
      stack: ["Python", "Raspberry Pi", "IoT"],
      repositoryUrl: "https://github.com/mohdb1lal",
    },
  ] satisfies Project[],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner (CLF-C02)",
      issuer: "Amazon Web Services",
      issued: "2026",
      verificationUrl: "https://www.credly.com/your-badge-link", // Replace with your actual Credly / AWS verification URL
    },
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      issuer: "Microsoft",
      issued: "2025",
      verificationUrl: "https://learn.microsoft.com/en-us/users/your-profile/credentials", // Replace with your Microsoft transcript/credential link
    }
  ] satisfies Certification[],
};
