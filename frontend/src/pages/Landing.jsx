import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PrototypeBadge } from "@/components/shared";

const AVATAR =
  "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODc2MDcyMTN8MA&ixlib=rb-4.1.0&q=85";

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </span>
            <span className="font-heading text-lg font-semibold text-navy">
              PF Resolve
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#top" className="transition-colors hover:text-navy" data-testid="nav-home">
              Home
            </a>
            <Link to="/transfer" className="transition-colors hover:text-navy" data-testid="nav-my-transfer">
              My Transfer
            </Link>
            <Link to="/transfer/help" className="transition-colors hover:text-navy" data-testid="nav-help-landing">
              Help
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <PrototypeBadge className="hidden sm:inline-flex" />
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3">
            <img src={AVATAR} alt="Rahul" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-sm font-semibold text-navy">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(10,25,47,0.25)]"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Your PF transfer
          </p>
          <p className="font-heading text-xl font-semibold text-navy">₹1,84,520</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" /> Needs attention
        </span>
      </div>
      <div className="space-y-3 py-4">
        {[
          ["UAN", true],
          ["Current employment", true],
          ["Previous employment", true],
          ["KYC", true],
          ["Date of Exit", false],
        ].map(([label, ok]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            {ok ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                <AlertTriangle className="h-4 w-4" /> Needs attention
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-navy px-4 py-3.5 text-white">
        <p className="text-[13px] font-medium text-white/70">Recommended action</p>
        <p className="text-sm font-semibold">
          Ask your previous employer to verify your Date of Exit.
        </p>
      </div>
    </motion.div>
  );
}

const VALUES = [
  { icon: Search, title: "Understand", text: "Turn confusing transfer statuses into plain-language explanations." },
  { icon: Wrench, title: "Fix", text: "Get a specific next action instead of searching for answers." },
  { icon: Activity, title: "Track", text: "See exactly where your transfer stands." },
];

const STEPS = [
  { n: "01", title: "Check", text: "PF Resolve reviews the simulated transfer record." },
  { n: "02", title: "Resolve", text: "The system identifies the blocker and explains what to do." },
  { n: "03", title: "Continue", text: "After the issue is resolved, you re-check and continue the transfer." },
];

export default function Landing() {
  return (
    <div id="top" className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              PF Transfer Support
            </span>
            <h1 className="mt-5 font-heading text-4xl font-medium tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Your PF transfer shouldn't require a government-process degree.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              PF Resolve explains why your PF transfer is stuck, tells you what
              needs to be fixed, and guides you through the next step.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/transfer"
                data-testid="hero-check-transfer-button"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Check my PF transfer <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                data-testid="hero-how-it-works-button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-navy transition-colors hover:border-navy"
              >
                See how it works
              </a>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-slate-200 bg-cream p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-navy">
                  {v.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 font-heading text-2xl font-medium tracking-tight text-navy">
            Designed around the moment citizens get stuck.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          How it works
        </span>
        <h2 className="mt-4 max-w-2xl font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Three steps from stuck to submitted.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-7">
              <span className="font-heading text-3xl font-semibold text-slate-200">
                {s.n}
              </span>
              <h3 className="mt-3 font-heading text-xl font-semibold text-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-navy p-10 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-2xl font-semibold">
              Ready to unblock your transfer?
            </h3>
            <p className="mt-1 text-white/70">
              Open the seeded demo account and walk the full journey.
            </p>
          </div>
          <Link
            to="/transfer"
            data-testid="cta-check-transfer-bottom"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-navy transition-transform duration-150 hover:-translate-y-0.5"
          >
            Check my PF transfer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-[13px] text-slate-500 lg:px-10">
          <p className="font-semibold text-navy">PF Resolve — hackathon prototype</p>
          <p>
            Prototype environment. Uses synthetic data and simulated
            government-system behavior. Not an official EPFO service and does not
            perform real government transactions.
          </p>
        </div>
      </footer>
    </div>
  );
}
