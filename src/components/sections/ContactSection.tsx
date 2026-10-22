import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Copy, Check, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { content } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { IconButton } from '../ui/IconButton';
import { GlassPill } from '../ui/GlassPill';

// Clean inline vector brand icons
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const DribbbleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.885 11.442c-.258-.024-2.855-.262-5.59.883-.102-.23-.207-.46-.318-.689-1.096-2.274-2.483-4.223-2.607-4.394 3.42 1.01 6.556 2.68 8.515 4.2zm-10.45-6.726c.15.207 1.512 2.115 2.606 4.34-3.567 1.097-7.254 1.157-7.616 1.161C5.556 7.42 8.214 5.34 11.435 4.716zM3.468 12.285c.34-.006 3.655-.072 7.086-1.116.326.666.63 1.346.908 2.036-4.99 1.572-9.28 1.488-9.718 1.478.175-.828.75-1.63 1.724-2.398zm3.018 7.397c.4-.006 4.14-.112 8.784-1.738.995 2.58 1.417 4.887 1.477 5.253-1.42.532-2.946.828-4.547.828-2.38 0-4.577-.665-6.444-1.815.17-.504.453-1.026.73-1.528zm11.758 2.497c-.07-.406-.474-2.583-1.428-5.068 2.493-1.077 4.72-.942 4.962-.924-.26 2.534-1.65 4.71-3.534 5.992zm3.844-7.854c-.28-.018-2.29-.12-4.606.84-.284-.66-.593-1.314-.925-1.954 2.528-1.084 4.996-.867 5.27-.84.204.622.316 1.276.316 1.954h-.055z" />
  </svg>
);

interface ContactSectionProps {
  onShowToast: (msg: string) => void;
}

export function ContactSection({ onShowToast }: ContactSectionProps) {
  const { author, socials } = content;
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headlineRef, { once: true, margin: '-60px' });

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(author.email);
    setHasCopied(true);
    onShowToast(`Email copied: ${author.email}`);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormState({ name: '', email: '', message: '' });
      onShowToast(`Message transmitted! ${author.name.split(' ')[0]} will respond shortly.`);

      // Delicate Apple-style celebratory particles
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FFC9A3', '#C9C3FA', '#A9C4FF', '#FFFFFF'],
        });
      } catch {
        // Fallback silently
      }
    }, 700);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <GithubIcon />;
      case 'x / twitter':
      case 'twitter':
        return <XIcon />;
      case 'linkedin':
        return <LinkedinIcon />;
      case 'dribbble':
        return <DribbbleIcon />;
      default:
        return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  return (
    <section id="contact" className="px-4 sm:px-8 pt-24 pb-36 max-w-4xl mx-auto relative z-10">
      {/* Section Tag */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold">
          05 // Dialogue
        </span>
      </div>

      {/* Focus Pull Headline */}
      <motion.h2
        ref={headlineRef}
        initial={{ opacity: 0, filter: 'blur(14px)', y: 12 }}
        animate={
          isInView
            ? { opacity: 1, filter: 'blur(0px)', y: 0 }
            : { opacity: 0, filter: 'blur(14px)', y: 12 }
        }
        transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-light text-center text-[var(--text)] tracking-tight mb-12"
      >
        Let's build something{' '}
        <span className="font-semibold text-neutral-950 dark:text-white drop-shadow-sm">calm</span>.
      </motion.h2>

      {/* Glass Form Card */}
      <GlassCard className="p-8 sm:p-12 backdrop-blur-3xl bg-white/70 dark:bg-neutral-900/60 border-white/80 dark:border-white/20 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium pl-3">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="Ada Lovelace"
                className="w-full px-5 py-3.5 rounded-full glass-surface bg-white/60 dark:bg-black/30 border border-white/80 dark:border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium pl-3">
                Your Email
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="ada@lovelace.studio"
                className="w-full px-5 py-3.5 rounded-full glass-surface bg-white/60 dark:bg-black/30 border border-white/80 dark:border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium pl-3">
              Project Scope & Intent
            </label>
            <textarea
              rows={3}
              required
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder="Tell me about what you are imagining, timeline, or spatial ambitions..."
              className="w-full px-5 py-3.5 rounded-3xl glass-surface bg-white/60 dark:bg-black/30 border border-white/80 dark:border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

          {/* Submit Action: Big capsule button with + icon in a circle on right end */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              data-cursor="Send"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-pill flex items-center justify-between sm:justify-center gap-4 bg-white/90 dark:bg-white/20 text-neutral-900 dark:text-white font-medium shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-white/90 dark:border-white/30 transition-all duration-300 cursor-pointer"
            >
              <span className="text-base">
                {isSubmitting ? 'Transmitting...' : 'Send message'}
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-md">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </span>
            </button>

            {/* "Copy email" pill with toast confirmation */}
            <GlassPill
              type="button"
              onClick={handleCopyEmail}
              data-cursor="Copy"
              className="w-full sm:w-auto text-xs py-2.5 px-4 bg-black/[0.03] dark:bg-white/[0.04] border-black/5 dark:border-white/10 hover:bg-black/[0.06]"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--text-2)]" />
                  <span>Copy email ({author.email})</span>
                </>
              )}
            </GlassPill>
          </div>
        </form>

        {/* Social Links as circular icon buttons */}
        <div className="mt-10 pt-6 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[var(--text-3)] font-medium">
            Available on verified digital networks
          </span>

          <div className="flex items-center gap-3">
            {socials.map((soc) => (
              <IconButton
                key={soc.platform}
                as="a"
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                size="md"
                tooltip={soc.platform}
                data-cursor="Connect"
              >
                {getSocialIcon(soc.platform)}
              </IconButton>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
