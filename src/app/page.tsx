import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Code2,
  Github,
  Linkedin,
  Mail,
  MoveUpRight,
  Sparkles,
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
        <a className="header-cta" href="#contact">Let&apos;s talk <ArrowUpRight size={15} /></a>
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="availability"><span className="status-dot" /> {portfolio.availability}</div>
          <p className="hero-kicker">{portfolio.location} <span>·</span> Available worldwide</p>
          <h1>Building useful<br />things for the <em>real world.</em></h1>
          <p className="hero-description">I&apos;m <strong>{portfolio.name}</strong>, a {portfolio.role.toLowerCase()} focused on Python, AWS, TypeScript, and full-stack product development.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#projects">Explore my work <ArrowDownRight size={17} /></a>
            <a className="text-link" href={`mailto:${portfolio.email}`}>Get in touch <ArrowUpRight size={15} /></a>
          </div>
          <div className="social-links" aria-label="Social profiles">
            <a href={portfolio.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href={portfolio.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
            <a href={portfolio.links.resume}><span className="resume-mark">PDF</span> Resume</a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Decorative software code illustration">
          <div className="visual-topline"><span><i /> <i /> <i /></span><span>shipping / v.01</span><Sparkles size={15} /></div>
          <div className="code-window">
            <p className="code-muted">{"// a small idea, made real"}</p>
            <p><span className="syntax-purple">const</span> <span className="syntax-blue">impact</span> = <span className="syntax-yellow">async</span> () =&gt; {'{'}</p>
            <p className="code-indent"><span className="syntax-purple">const</span> problem = <span className="syntax-green">&quot;worth solving&quot;</span>;</p>
            <p className="code-indent"><span className="syntax-purple">const</span> solution = <span className="syntax-blue">build</span>(problem);</p>
            <p className="code-indent"><span className="syntax-purple">return</span> solution.<span className="syntax-yellow">ship</span>();</p>
            <p>{'}'};</p>
            <div className="code-divider" />
            <div className="code-footer"><span><span className="status-dot" /> Currently building</span><span>Python · TypeScript · AWS</span></div>
          </div>
          <div className="visual-index"><span>001 — 004</span><span>ENGINEERING, WITH INTENTION</span></div>
          <div className="visual-stamp">MAKE<br />IT<br /><span>MATTER.</span></div>
        </div>
        <a className="scroll-cue" href="#snapshot"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={14} /></a>
      </section>

      <section className="snapshot section-wrap" id="snapshot" aria-labelledby="snapshot-title">
        <div className="section-label"><span>AT A GLANCE</span><span>01 / 04</span></div>
        <div className="snapshot-intro"><h2 id="snapshot-title">Proof over promises.</h2><p>A quick look at the work and practice behind the code. Live stats sync from my public profiles.</p></div>
        <Snapshot />
        <p className="snapshot-footnote"><span className="tiny-dot" /> Replace the starter profile data with your own to bring these numbers to life.</p>
      </section>

      <section className="projects-section section-wrap" id="projects" aria-labelledby="projects-title">
        <div className="section-label"><span>SELECTED WORK</span><span>02 / 04</span></div>
        <div className="section-heading-row"><div><p className="eyebrow">Built with purpose</p><h2 id="projects-title">Projects that do<br />more than compile.</h2></div><p className="section-aside">A few things I&apos;ve designed, built, and put into the world. Every card links to the code or a working demo.</p></div>
        {portfolio.projects.length ? (
          <div className="project-grid">{portfolio.projects.map((project, index) => <article className="project-card" key={project.name}><div className={`project-art project-art-${index % 3}`}><span className="project-number">0{index + 1}</span><div className="project-art-lines"><i /><i /><i /></div><span className="project-art-caption">{project.stack.slice(0, 2).join(" / ")}</span></div><div className="project-info"><div><span className="eyebrow">{project.featured ? "FEATURED PROJECT" : "PROJECT"}</span><h3>{project.name}</h3></div><p>{project.description}</p><div className="project-bottom"><div className="tag-list">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="project-links"><a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} source code`}><Github size={17} /></a>{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}><MoveUpRight size={17} /></a>}</div></div></div></article>)}</div>
        ) : <div className="content-empty"><div className="empty-icon"><Code2 size={20} /></div><div><h3>Your next project belongs here.</h3><p>Add a project to <code>src/data/portfolio.ts</code> with a short story, tech stack, and a link to the source. Strong proof beats a long skills list.</p></div><a href={portfolio.links.github} target="_blank" rel="noreferrer">Browse GitHub <ArrowUpRight size={15} /></a></div>}
      </section>

      <section className="cert-section section-wrap" id="certifications" aria-labelledby="certifications-title">
        <div className="section-label"><span>CONTINUOUS LEARNING</span><span>03 / 04</span></div>
        <div className="section-heading-row cert-heading"><div><p className="eyebrow">Credentials, not claims</p><h2 id="certifications-title">Earned &amp; verified.</h2></div><p className="section-aside">Every credential should be one click away from its verification source.</p></div>
        {portfolio.certifications.length ? <div className="cert-grid">{portfolio.certifications.map((certification) => <a className="cert-card" href={certification.verificationUrl} target="_blank" rel="noreferrer" key={certification.name}><span className="cert-icon"><Award size={19} /></span><span className="cert-copy"><span className="eyebrow">{certification.issuer} · {certification.issued}</span><strong>{certification.name}</strong><span className="cert-verify">Verify credential <ArrowUpRight size={13} /></span></span><ArrowUpRight className="cert-arrow" size={17} /></a>)}</div> : <div className="cert-empty"><Award size={18} /><p>Add certifications to <code>src/data/portfolio.ts</code> with issuer, date, and a verification link.</p></div>}
      </section>

      <section className="activity-section section-wrap" id="activity" aria-labelledby="activity-title">
        <div className="section-label"><span>OPEN SOURCE &amp; PRACTICE</span><span>LIVE DATA</span></div>
        <div className="section-heading-row"><div><p className="eyebrow">The work between the work</p><h2 id="activity-title">Consistency is<br />a feature.</h2></div><p className="section-aside">A little progress, repeated daily, compounds. These panels pull public stats from my developer profiles.</p></div>
        <Analytics />
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner section-wrap">
          <div className="section-label"><span>04 / 04 — YOUR MOVE</span><span>CONTACT</span></div>
          <div className="contact-main"><div><p className="eyebrow">Have a good problem?</p><h2>Let&apos;s make<br /><em>something matter.</em></h2></div><a className="contact-button" href={`mailto:${portfolio.email}`} aria-label={`Email ${portfolio.name}`}><ArrowUpRight size={28} /></a></div>
          <div className="contact-bottom"><p>I&apos;m always up for a thoughtful conversation about engineering, teams, and what we can build next.</p><div className="contact-links"><a href={`mailto:${portfolio.email}`}><Mail size={16} /> {portfolio.email}</a><a href={portfolio.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a><a href={portfolio.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a><a href={portfolio.links.resume}><span className="resume-mark">PDF</span> Resume</a></div></div>
        </div>
      </section>

      <footer className="site-footer section-wrap"><a className="wordmark" href="#home">{initials}<span>.</span></a><span>Designed &amp; built with intention.</span><span>© {new Date().getFullYear()} {portfolio.name}</span><a className="back-top" href="#home">Back to top <ArrowRight size={14} /></a></footer>
    </main>
  );
}
