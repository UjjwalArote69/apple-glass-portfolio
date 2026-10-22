import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Copy, Check } from 'lucide-react';
import { content } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { SocialIcon } from '../ui/BrandIcons';
import { LocalTime } from '../ui/LocalTime';

interface ContactSectionProps {
  onShowToast: (msg: string) => void;
}

export function ContactSection({ onShowToast }: ContactSectionProps) {
  const { author, socials } = content;
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headlineRef, { once: true, margin: '-60px' });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  // Placeholder entries without a real URL aren't worth a click
  const links = socials.filter((social) => social.url && social.url !== '#');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(author.email);
      setCopied(true);
      onShowToast(`Copied ${author.email}`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(`Couldn't copy. The address is ${author.email}`);
    }
  };

  // No backend: hand the message to the visitor's own email app, already addressed and filled in
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Hello from ${form.name}`;
    const body = `${form.message}\n\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${author.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <section id="contact" className="px-4 sm:px-8 pt-24 pb-36 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold">05 // Contact</span>
      </div>

      {/* Focus Pull Headline */}
      <motion.h2
        ref={headlineRef}
        initial={{ opacity: 0, filter: 'blur(14px)', y: 12 }}
        animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(14px)', y: 12 }}
        transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-light text-center text-[var(--text)] tracking-tight"
      >
        Let&apos;s build something <span className="font-serif italic">calm</span>.
      </motion.h2>
      <p className="mt-5 mb-12 text-center text-[15px] sm:text-base text-[var(--text-2)] max-w-lg mx-auto">
        I&apos;m open to AI and full-stack roles. Write to me about a role, a project, or anything you&apos;ve seen here.
      </p>

      <GlassCard className="p-0 about-card">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Direct details */}
          <aside className="lg:col-span-5 p-7 sm:p-10 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r about-rule">
            <div>
              <p className="menu-label">Email</p>
              <a href={`mailto:${author.email}`} className="contact-email" data-cursor="Write">
                {author.email}
              </a>
              <button type="button" onClick={copyEmail} className="contact-copy" data-cursor="Copy">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy address'}
              </button>
            </div>

            <div>
              <p className="menu-label">Status</p>
              <p className="flex items-center gap-2 text-[15px] font-medium text-[var(--text)]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {author.statusText}
              </p>
              <p className="mt-1 text-[13px] text-[var(--text-2)]">
                {author.location} · <LocalTime /> local time
              </p>
            </div>

            {links.length > 0 && (
              <div>
                <p className="menu-label">Elsewhere</p>
                <ul className="-mx-2">
                  {links.map((social) => (
                    <li key={social.platform}>
                      <a href={social.url} target="_blank" rel="noreferrer" className="contact-social group">
                        <span className="contact-social-icon">
                          <SocialIcon platform={social.platform} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-[var(--text)]">{social.platform}</span>
                          <span className="block text-[12.5px] text-[var(--text-2)] truncate">{social.handle}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[var(--text-3)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Message form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-7 sm:p-10 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="contact-field">
                <span>Name</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="contact-input"
                />
              </label>
              <label className="contact-field">
                <span>Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="contact-input"
                />
              </label>
            </div>

            <label className="contact-field">
              <span>Message</span>
              <textarea
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="A few lines about the role or project…"
                className="contact-input resize-none"
              />
            </label>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <button type="submit" className="about-cta group justify-center shrink-0 whitespace-nowrap" data-cursor="Send">
                Send message
                <ArrowRight className="w-4 h-4 stroke-[1.75] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="text-[13px] text-[var(--text-3)]">Opens your email app with this message ready to send.</p>
            </div>

            {opened && (
              <p role="status" className="contact-note">
                Your email app should have opened with the message. If it didn&apos;t, write to{' '}
                <a href={`mailto:${author.email}`} className="about-link">
                  {author.email}
                </a>
                .
              </p>
            )}
          </form>
        </div>
      </GlassCard>
    </section>
  );
}
