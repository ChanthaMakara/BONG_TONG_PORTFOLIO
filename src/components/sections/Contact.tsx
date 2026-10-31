import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRightIcon, CheckIcon, CopyIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { FadeIn } from '../motion/FadeIn';
import { RevealText } from '../motion/RevealText';
import { SectionLabel } from '../ui/SectionLabel';
import { EASE_OUT } from '../../utils/motion';

/* ---------- Brand icons (inline so there's no icon-version dependency) ---------- */
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.1 13.2.2 11.7c-1.1-.3-1.1-1 .2-1.5L20.5 2.5c.9-.3 1.7.2 1.4 1.8Z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.5V13h2.8v8h3.2Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const socials = [
  {
    name: 'Telegram',
    handle: '@maa_tong',
    href: 'https://t.me/maa_tong',
    icon: <TelegramIcon />,
    tint: 'hover:border-sky-500/50 hover:text-sky-500',
  },
  {
    name: 'Facebook',
    handle: 'Piseth Maratong',
    href: 'https://www.facebook.com/share/1DViiyxBS5/?mibextid=wwXIfr',
    icon: <FacebookIcon />,
    tint: 'hover:border-blue-500/50 hover:text-blue-500',
  },
  {
    name: 'Instagram',
    handle: '@maa__tong',
    href: 'https://www.instagram.com/maa__tong',
    icon: <InstagramIcon />,
    tint: 'hover:border-pink-500/50 hover:text-pink-500',
  },
];

/* ---------- Reusable glass surface with mouse-follow spotlight ---------- */
function GlassCard({
  children,
  className = '',
  delay = 0,
  as = 'div',
  href,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'a';
  href?: string;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(245,158,11,0.18), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const Component = (as === 'a' ? motion.a : motion.div) as typeof motion.div;
  const linkProps = as === 'a' ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      {...(linkProps as object)}
      initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      whileHover={reduce ? undefined : { y: -5 }}
      onMouseMove={onMove}
      className={`group relative block overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ink/10 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="relative block">{children}</span>
    </Component>
  );
}

/* ---------- Section ---------- */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-bg py-24 md:py-40"
      aria-labelledby="contact-title"
    >
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -right-32 top-10 h-[460px] w-[460px] rounded-full bg-amber-500/25 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -left-32 bottom-10 h-[460px] w-[460px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[280px] w-[280px] rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel>Get in touch</SectionLabel>
        <RevealText
          as="h2"
          text="Let’s light your next story."
          className="mt-6 block max-w-5xl font-display text-[clamp(3rem,8.5vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
        />

        <div className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12">
          {/* ---------- Left: email + socials ---------- */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <GlassCard className="p-6 md:p-10">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">Email</span>
              <span className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 font-display text-[clamp(1.4rem,3.2vw,3rem)] font-medium tracking-[-0.03em] transition-[background-size] duration-300 ease-out-expo hover:bg-[length:100%_1px]"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="flex h-11 items-center gap-2 rounded-full border border-ink/20 bg-ink/5 px-4 text-sm backdrop-blur-md transition-[border-color,transform,background-color] duration-200 hover:border-amber-500/60 hover:bg-amber-500/10 active:scale-95"
                >
                  {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                  <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </span>
            </GlassCard>

            <div>
              <FadeIn>
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">Find me on</p>
              </FadeIn>
              <ul className="grid gap-4 sm:grid-cols-3">
                {socials.map((s, i) => (
                  <li key={s.name}>
                    <GlassCard
                      as="a"
                      href={s.href}
                      delay={0.08 * i}
                      className={`p-5 transition-colors duration-300 ${s.tint}`}
                    >
                      <span className="flex items-start justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current/30 bg-ink/5 backdrop-blur-md">
                          {s.icon}
                        </span>
                        <ArrowUpRightIcon
                          size={18}
                          className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-current"
                        />
                      </span>
                      <span className="mt-6 block font-display text-lg font-medium tracking-tight text-ink">
                        {s.name}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-muted">{s.handle}</span>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Right: details card ---------- */}
          <div className="lg:col-span-5">
            <GlassCard delay={0.1} className="h-full p-6 md:p-10">
              <dl className="space-y-7">
                <ContactRow icon={<PhoneIcon size={16} />} label="Phone">
                  <a href={profile.phoneHref} className="hover:underline">
                    {profile.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPinIcon size={16} />} label="Address">
                  {profile.address}
                </ContactRow>
              </dl>

              <a
                href={`mailto:${profile.email}`}
                className="group/btn relative mt-10 flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-ink text-sm font-semibold text-bg transition-transform duration-200 active:scale-[0.98]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
                />
                <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover/btn:text-white">
                  <MailIcon size={16} /> Send an email
                </span>
              </a>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-ink/5 text-muted backdrop-blur-md">
        {icon}
      </span>
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-1 text-[15px] font-medium leading-snug">{children}</dd>
      </div>
    </div>
  );
}