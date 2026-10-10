import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MB — Software Engineer",
  description:
    "A software engineering portfolio highlighting projects, certifications, and developer activity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
