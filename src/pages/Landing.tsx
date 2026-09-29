import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Gem, ArrowRight, Shield, Activity, CheckCircle2, ChevronRight,
  TrendingUp, Users, FileText, Bell, Sparkles, Star, Briefcase, Truck
} from 'lucide-react'
import { GlowButton } from '../components/ui/GlowButton'
import { GlassCard } from '../components/ui/GlassCard'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-highlight relative overflow-x-hidden">
      <AnimatedBackground />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-nav px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-glow">
            <Gem size={18} className="text-white" />
          </div>
          <span className="text-base font-bold font-sora gradient-text-bright">Mistry Gems</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-glass">
          <a href="#features" className="hover:text-highlight transition-colors">Features</a>
          <a href="#workflow" className="hover:text-highlight transition-colors">Workflow</a>
          <a href="#testimonials" className="hover:text-highlight transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton variant="outline" size="sm" onClick={() => navigate('/login')}>Log In</GlowButton>
          <GlowButton size="sm" onClick={() => navigate('/login')}>Get Started</GlowButton>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          SCROLL 1 — Hero + Preview + Stats
      ══════════════════════════════════════════ */}
      <section className="relative pt-28 pb-8 px-6 max-w-6xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-glass/20 backdrop-blur-xl animate-pulse-glow">
          <Sparkles size={13} className="text-accent" />
          <span className="text-xs font-semibold gradient-text-bright">Industry 4.0 Platform for MSME Manufacturers</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sora leading-tight gradient-text-bright max-w-4xl mx-auto">
          Digitize Manufacturing Workflows with Mistry Gems
        </h1>

        <p className="text-sm sm:text-base text-glass max-w-2xl mx-auto leading-relaxed">
          Replace WhatsApp groups, spreadsheets & notebooks with one centralized workspace — jobs, quotations, tasks, teams and analytics, all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GlowButton size="lg" icon={<ArrowRight size={18} />} onClick={() => navigate('/login')}>
            Get Started Free
          </GlowButton>
          <GlowButton variant="outline" size="lg" onClick={() => navigate('/login')}>
            Request Demo
          </GlowButton>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { val: '3.5x', label: 'Faster Job Processing' },
            { val: '80%', label: 'Less Manual Work' },
            { val: '100%', label: 'Workflow Visibility' },
            { val: '45%', label: 'Productivity Boost' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-glass/10 text-center">
              <span className="text-xl font-extrabold font-sora gradient-text-bright block">{s.val}</span>
              <span className="text-[10px] text-glass-dim">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <GlassCard className="p-4 sm:p-5 shadow-glass-lg border-glass-bright max-w-5xl mx-auto text-left space-y-4">
          <div className="flex items-center justify-between border-b border-glass/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-glass-dim ml-2">mistrygems.app/dashboard</span>
            </div>
            <span className="text-xs font-semibold text-accent bg-[#00B4D8]/10 px-3 py-1 rounded-full">Live Preview</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Jobs', val: '12 Orders', color: 'text-highlight' },
              { label: 'Monthly Revenue', val: '₹4,65,000', color: 'text-emerald-400' },
              { label: 'Workforce Active', val: '6 Staff', color: 'text-accent' },
              { label: 'Delivery Rate', val: '98.4%', color: 'text-highlight' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-glass/10">
                <span className="text-[10px] text-glass-dim block">{s.label}</span>
                <span className={`text-base font-bold font-sora ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ══════════════════════════════════════════
          SCROLL 2 — Features + Workflow
      ══════════════════════════════════════════ */}
      <section id="features" className="py-10 px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="glass-badge">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-sora gradient-text-bright">Everything to Run a Smart Workshop</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Job Management', desc: 'Live tables & Kanban boards for manufacturing orders.', icon: <Briefcase size={20} className="text-accent" /> },
            { title: 'GST Quotations', desc: 'Precise quotations with automated tax calculation.', icon: <FileText size={20} className="text-accent" /> },
            { title: 'Task Assignment', desc: 'Assign tasks to workers with priorities & deadlines.', icon: <CheckCircle2 size={20} className="text-accent" /> },
            { title: 'Workflow Tracking', desc: 'Monitor production from raw material to dispatch.', icon: <Activity size={20} className="text-accent" /> },
            { title: 'Team Management', desc: 'Track staff, performance and assigned job counts.', icon: <Users size={20} className="text-accent" /> },
            { title: 'Reports & Analytics', desc: 'Revenue trends and completed job velocity charts.', icon: <TrendingUp size={20} className="text-accent" /> },
            { title: 'Notifications', desc: 'Instant alerts for status transitions & quality checks.', icon: <Bell size={20} className="text-accent" /> },
            { title: 'Customer Directory', desc: 'Central directory of clients and order histories.', icon: <Shield size={20} className="text-accent" /> },
          ].map(f => (
            <GlassCard key={f.title} className="p-4 space-y-2">
              <div className="feature-icon-ring w-9 h-9 rounded-xl">{f.icon}</div>
              <h3 className="text-sm font-bold text-highlight font-sora">{f.title}</h3>
              <p className="text-[11px] text-glass-dim leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Workflow — horizontal steps */}
        <div id="workflow" className="space-y-3">
          <div className="text-center space-y-1">
            <span className="glass-badge">Workflow Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sora gradient-text-bright">Step-by-Step Production</h2>
          </div>
          <GlassCard className="p-5">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              {[
                'Customer Request', 'Create Job', 'GST Quotation',
                'Assign Operator', 'Work In Progress', 'Quality Check', 'Dispatch & Invoice'
              ].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0077B6]/20 border border-[#00B4D8]/30 text-highlight whitespace-nowrap">{step}</span>
                  {i < arr.length - 1 && <ChevronRight size={14} className="text-accent flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SCROLL 3 — Testimonials + CTA + Footer
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="py-10 px-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="glass-badge">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-sora gradient-text-bright">Trusted by Workshop Owners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Ramesh Agarwal', role: 'Manufacturing Owner', company: 'Shree Auto Parts', text: 'Replaced 5 WhatsApp groups and spreadsheets. Job delivery speed increased dramatically.' },
            { name: 'Dinesh Mehta', role: 'Production Manager', company: 'Bharat Fabricators', text: 'Real-time task tracking eliminated production confusion across shift changes.' },
            { name: 'Sunil Verma', role: 'Workshop Supervisor', company: 'Precision Engineers', text: 'Instant GST quotation generation saves hours every week. A must-have for MSMEs.' },
          ].map(t => (
            <GlassCard key={t.name} className="p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
              </div>
              <p className="text-xs text-glass italic leading-relaxed">"{t.text}"</p>
              <div className="border-t border-glass/10 pt-2">
                <h4 className="text-xs font-bold text-highlight">{t.name}</h4>
                <p className="text-[10px] text-glass-dim">{t.role} — {t.company}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <GlassCard className="p-8 text-center space-y-4 border-glass-bright bg-white/5 shadow-glass-lg">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-sora gradient-text-bright">
            Ready to Modernize Your Workshop?
          </h2>
          <p className="text-sm text-glass max-w-xl mx-auto">
            Join manufacturing MSMEs using Mistry Gems to simplify workflows and accelerate growth.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton size="lg" onClick={() => navigate('/login')}>Start Free Trial</GlowButton>
            <GlowButton variant="outline" size="lg" onClick={() => navigate('/login')}>Schedule Demo</GlowButton>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass/10 py-6 px-6 text-xs text-glass-dim">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center">
              <Gem size={14} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-highlight font-sora text-xs">Mistry Gems</p>
              <p className="text-[10px]">Workflow Management Platform</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Mistry Gems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
