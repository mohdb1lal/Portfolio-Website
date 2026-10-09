import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Code2,
  Github,
  Linkedin,
  Mail,
  MoveUpRight,
} from "lucide-react";
import { Analytics } from "@/components/analytics";
import { Snapshot } from "@/components/snapshot";
import { portfolio } from "@/data/portfolio";

const navigation = [
  { label: "Work", href: "#projects" },
  { label: "Credentials", href: "#certifications" },
  { label: "Activity", href: "#activity" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  const initials = portfolio.name === "Your Name" ? "YN" : portfolio.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Back to top">{initials}<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">Contact <ArrowUpRight size={15} /></a>
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="availability"><span className="status-dot" /> {portfolio.availability}</div>
          <p className="hero-kicker">{portfolio.location} <span>·</span> Available worldwide</p>
          <h1>{portfolio.name}</h1>
          <p className="hero-role">{portfolio.role}</p>
          <p className="hero-description">{portfolio.intro}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#projects">View projects <ArrowDownRight size={17} /></a>
            <a className="text-link" href={`mailto:${portfolio.email}`}>Email <ArrowUpRight size={15} /></a>
          </div>
          <div className="social-links" aria-label="Social profiles">
            <a href={portfolio.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href={portfolio.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
            <a href={portfolio.links.resume}><span className="resume-mark">PDF</span> Resume</a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Decorative software code illustration">
          <div className="visual-topline"><span><i /> <i /> <i /></span><span>code sample</span></div>
          <div className="code-window">
            <p className="code-muted">{"// selected technologies"}</p>
            <p><span className="syntax-purple">const</span> <span className="syntax-blue">stack</span> = {'{'}</p>
            <p className="code-indent"><span className="syntax-purple">language</span>: <span className="syntax-green">&quot;Python&quot;</span>,</p>
            <p className="code-indent"><span className="syntax-purple">cloud</span>: <span className="syntax-green">&quot;AWS&quot;</span>,</p>
            <p className="code-indent"><span className="syntax-purple">frontend</span>: <span className="syntax-green">&quot;TypeScript&quot;</span></p>
            <p>{'}'};</p>
            <div className="code-divider" />
            <div className="code-footer"><span><span className="status-dot" /> {portfolio.availability}</span></div>
          </div>
          <div className="visual-index"><span>Python · TypeScript · AWS</span></div>
        </div>
        <a className="scroll-cue" href="#snapshot"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={14} /></a>
      </section>

      <section className="snapshot section-wrap" id="snapshot" aria-labelledby="snapshot-title">
        <div className="section-label"><span>AT A GLANCE</span><span>01 / 04</span></div>
        <div className="snapshot-intro"><h2 id="snapshot-title">Overview</h2><p>Selected projects and activity from my public profiles.</p></div>
        <Snapshot />
        <p className="snapshot-footnote"><span className="tiny-dot" /> Replace the starter profile data with your own to bring these numbers to life.</p>
      </section>

      <section className="projects-section section-wrap" id="projects" aria-labelledby="projects-title">
        <div className="section-label"><span>SELECTED WORK</span><span>02 / 04</span></div>
        <div className="section-heading-row"><div><p className="eyebrow">Projects</p><h2 id="projects-title">Selected work</h2></div><p className="section-aside">A selection of projects, with links to source code and demos.</p></div>
        {portfolio.projects.length ? (
          <div className="project-grid">{portfolio.projects.map((project, index) => <article className="project-card" key={project.name}><div className={`project-art project-art-${index % 3}`}><span className="project-number">0{index + 1}</span><div className="project-art-lines"><i /><i /><i /></div><span className="project-art-caption">{project.stack.slice(0, 2).join(" / ")}</span></div><div className="project-info"><div><span className="eyebrow">{project.featured ? "FEATURED PROJECT" : "PROJECT"}</span><h3>{project.name}</h3></div><p>{project.description}</p><div className="project-bottom"><div className="tag-list">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="project-links"><a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} source code`}><Github size={17} /></a>{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}><MoveUpRight size={17} /></a>}</div></div></div></article>)}</div>
        ) : <div className="content-empty"><div className="empty-icon"><Code2 size={20} /></div><div><h3>Your next project belongs here.</h3><p>Add a project to <code>src/data/portfolio.ts</code> with a short story, tech stack, and a link to the source. Strong proof beats a long skills list.</p></div><a href={portfolio.links.github} target="_blank" rel="noreferrer">Browse GitHub <ArrowUpRight size={15} /></a></div>}
      </section>

      <section className="cert-section section-wrap" id="certifications" aria-labelledby="certifications-title">
        <div className="section-label"><span>CONTINUOUS LEARNING</span><span>03 / 04</span></div>
        <div className="section-heading-row cert-heading"><div><p className="eyebrow">Certifications</p><h2 id="certifications-title">Credentials</h2></div><p className="section-aside">Professional certifications and verification links.</p></div>
        {portfolio.certifications.length ? <div className="cert-grid">{portfolio.certifications.map((certification) => <a className="cert-card" href={certification.verificationUrl} target="_blank" rel="noreferrer" key={certification.name}><span className="cert-icon"><Award size={19} /></span><span className="cert-copy"><span className="eyebrow">{certification.issuer} · {certification.issued}</span><strong>{certification.name}</strong><span className="cert-verify">Verify credential <ArrowUpRight size={13} /></span></span><ArrowUpRight className="cert-arrow" size={17} /></a>)}</div> : <div className="cert-empty"><Award size={18} /><p>Add certifications to <code>src/data/portfolio.ts</code> with issuer, date, and a verification link.</p></div>}
      </section>

      <section className="activity-section section-wrap" id="activity" aria-labelledby="activity-title">
        <div className="section-label"><span>OPEN SOURCE &amp; PRACTICE</span><span>LIVE DATA</span></div>
        <div className="section-heading-row"><div><p className="eyebrow">Activity</p><h2 id="activity-title">Developer activity</h2></div><p className="section-aside">Public stats from my developer profiles.</p></div>
        <Analytics />
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner section-wrap">
          <div className="section-label"><span>04 / 04</span><span>CONTACT</span></div>
          <div className="contact-main"><div><p className="eyebrow">Get in touch</p><h2>Contact</h2></div><a className="contact-button" href={`mailto:${portfolio.email}`} aria-label={`Email ${portfolio.name}`}><ArrowUpRight size={28} /></a></div>
          <div className="contact-bottom"><p>Contact me by email or connect on LinkedIn.</p><div className="contact-links"><a href={`mailto:${portfolio.email}`}><Mail size={16} /> {portfolio.email}</a><a href={portfolio.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a><a href={portfolio.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a><a href={portfolio.links.resume}><span className="resume-mark">PDF</span> Resume</a></div></div>
        </div>
      </section>

      <footer className="site-footer section-wrap"><span>Designed &amp; Built by {portfolio.name}. v2.0.0</span></footer>
    </main>
  );
}
