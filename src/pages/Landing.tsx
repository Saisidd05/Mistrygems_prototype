import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Gem, ArrowRight, Shield, Zap, Activity, CheckCircle2, ChevronRight,
  TrendingUp, Users, Cpu, FileText, Bell, Layers, Sparkles, Star, MessageSquare, Briefcase
} from 'lucide-react'
import { GlowButton } from '../components/ui/GlowButton'
import { GlassCard, StatCard } from '../components/ui/GlassCard'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-highlight relative overflow-x-hidden">
      {/* Glass Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-nav px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-glow">
            <Gem size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold font-sora gradient-text-bright">Mistry Gems</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-glass">
          <a href="#about" className="hover:text-highlight transition-colors">About</a>
          <a href="#features" className="hover:text-highlight transition-colors">Features</a>
          <a href="#why-us" className="hover:text-highlight transition-colors">Why Mistry Gems</a>
          <a href="#workflow" className="hover:text-highlight transition-colors">Workflow Journey</a>
          <a href="#preview" className="hover:text-highlight transition-colors">Dashboard Preview</a>
          <a href="#testimonials" className="hover:text-highlight transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-3">
          <GlowButton variant="outline" size="sm" onClick={() => navigate('/login')}>
            Log In
          </GlowButton>
          <GlowButton size="sm" onClick={() => navigate('/login')}>
            Get Started
          </GlowButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-glass/20 backdrop-blur-xl animate-pulse-glow">
          <Sparkles size={14} className="text-accent" />
          <span className="text-xs font-semibold gradient-text-bright">Industry 4.0 Platform for MSME Manufacturers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-sora leading-tight gradient-text-bright max-w-4xl mx-auto">
          Digitize Manufacturing Workflows with Mistry Gems
        </h1>

        <p className="text-base sm:text-lg text-glass max-w-2xl mx-auto leading-relaxed">
          Empower manufacturing MSMEs with an intelligent workflow management platform that centralizes jobs, quotations, task assignments, employee collaboration, workflow tracking, and business insights—all in one secure, modern workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <GlowButton size="lg" icon={<ArrowRight size={18} />} onClick={() => navigate('/login')}>
            Get Started
          </GlowButton>
          <GlowButton variant="outline" size="lg" onClick={() => navigate('/login')}>
            Request Demo
          </GlowButton>
        </div>

        {/* Dashboard Preview Card */}
        <div id="preview" className="pt-12">
          <GlassCard className="p-4 sm:p-6 shadow-glass-lg border-glass-bright dashboard-preview max-w-5xl mx-auto text-left space-y-6">
            <div className="flex items-center justify-between border-b border-glass/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-glass-dim ml-2">mistrygems.app/dashboard</span>
              </div>
              <span className="text-xs font-semibold text-accent bg-[#00B4D8]/10 px-3 py-1 rounded-full">Live Interactive Preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-glass/10">
                <span className="text-[10px] text-glass-dim block">Active Jobs</span>
                <span className="text-lg font-bold text-highlight font-sora">12 Orders</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-glass/10">
                <span className="text-[10px] text-glass-dim block">Monthly Revenue</span>
                <span className="text-lg font-bold text-emerald-400 font-sora">₹4,65,000</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-glass/10">
                <span className="text-[10px] text-glass-dim block">Workforce Active</span>
                <span className="text-lg font-bold text-accent font-sora">6 Staff</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-glass/10">
                <span className="text-[10px] text-glass-dim block">Delivery Rate</span>
                <span className="text-lg font-bold text-highlight font-sora">98.4%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="glass-badge">About Mistry Gems</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text-bright">Built Exclusively for Manufacturing MSMEs</h2>
        </div>

        <GlassCard className="p-8 sm:p-10 space-y-6 text-glass leading-relaxed">
          <p className="text-base sm:text-lg">
            Mistry Gems is a modern workflow management platform built exclusively for manufacturing MSMEs. It replaces disconnected tools like WhatsApp, spreadsheets, notebooks, and phone calls with one centralized digital workspace where businesses can manage jobs, quotations, teams, tasks, and operational workflows efficiently.
          </p>

          <div className="pt-4 border-t border-glass/10">
            <h3 className="text-sm font-bold text-highlight font-sora mb-6 text-center">Seamless End-to-End Workflow Flow</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              {['Customer Request', 'Create Job', 'Generate Quotation', 'Assign Employee', 'Track Progress', 'Quality Check', 'Completed', 'Delivered'].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0077B6]/20 border border-[#00B4D8]/30 text-highlight">{step}</span>
                  {i < arr.length - 1 && <ChevronRight size={14} className="text-accent" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="glass-badge">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text-bright">Everything Needed to Run a Smart Workshop</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Job Management', desc: 'Create, monitor and filter manufacturing orders through live tables and Kanban boards.', icon: <Briefcase size={22} className="text-accent" /> },
            { title: 'Quotation Management', desc: 'Generate precise quotations with automated GST tax calculation.', icon: <FileText size={22} className="text-accent" /> },
            { title: 'Task Assignment', desc: 'Assign machine tasks to workers with priorities, deadlines and tag filters.', icon: <CheckCircle2 size={22} className="text-accent" /> },
            { title: 'Workflow Tracking', desc: 'Monitor production from raw material stage to finished dispatch.', icon: <Activity size={22} className="text-accent" /> },
            { title: 'Employee Management', desc: 'Track department staff, performance indexes, and assigned job counts.', icon: <Users size={22} className="text-accent" /> },
            { title: 'Reports & Analytics', desc: 'Visual dashboards with revenue trends and completed job velocity.', icon: <TrendingUp size={22} className="text-accent" /> },
            { title: 'Real-time Notifications', desc: 'Instant alerts for job status transitions and quality check results.', icon: <Bell size={22} className="text-accent" /> },
            { title: 'Customer Management', desc: 'Central directory of client companies and order histories.', icon: <Shield size={22} className="text-accent" /> },
          ].map(f => (
            <GlassCard key={f.title} className="p-6 space-y-3 tilt-hover">
              <div className="feature-icon-ring">{f.icon}</div>
              <h3 className="text-base font-bold text-highlight font-sora">{f.title}</h3>
              <p className="text-xs text-glass-dim leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Why Mistry Gems & Benefits */}
      <section id="why-us" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="glass-badge">Why Mistry Gems</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text-bright">Modernize Operations with Industry 4.0 Speed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Faster Job Processing', val: '3.5x Speedup' },
            { label: 'Better Team Coordination', val: '100% Visibility' },
            { label: 'Reduced Manual Work', val: '80% Less Paper' },
            { label: 'Increased Productivity', val: '45% Boost' },
            { label: 'Improved Workflow Transparency', val: 'Real-Time' },
            { label: 'Affordable ERP Alternative', val: 'Low Overhead' },
          ].map(b => (
            <GlassCard key={b.label} className="p-6 text-center space-y-2">
              <span className="text-3xl font-extrabold font-sora gradient-text-bright block">{b.val}</span>
              <span className="text-xs text-glass-dim font-medium">{b.label}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Workflow Journey */}
      <section id="workflow" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="glass-badge">Workflow Journey</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text-bright">Step-by-Step Production Process</h2>
        </div>

        <GlassCard className="p-8 space-y-6">
          {[
            { step: '01', title: 'Customer Request', desc: 'Customer submits order specifications via client portal or phone.' },
            { step: '02', title: 'Create Job & Quotation', desc: 'Workshop owner generates structured job and instant GST quotation.' },
            { step: '03', title: 'Assign Team & Procure', desc: 'Task assigned to specialized CNC or fabrication operator.' },
            { step: '04', title: 'Work In Progress & Quality Check', desc: 'Machine operator updates progress until quality inspector verifies.' },
            { step: '05', title: 'Completed & Delivered', desc: 'Final invoice generated and completed order dispatched to client.' },
          ].map((item, i) => (
            <div key={item.step} className="flex gap-4 items-start border-b border-glass/10 pb-4 last:border-0 last:pb-0">
              <span className="text-xl font-bold font-mono text-accent">{item.step}</span>
              <div>
                <h4 className="text-sm font-bold text-highlight font-sora">{item.title}</h4>
                <p className="text-xs text-glass-dim mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </GlassCard>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="glass-badge">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text-bright">Trusted by Workshop Owners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Ramesh Agarwal', role: 'Manufacturing Owner', company: 'Shree Auto Parts', text: 'Mistry Gems replaced 5 different WhatsApp groups and spreadsheets. Our job delivery speed increased dramatically.' },
            { name: 'Dinesh Mehta', role: 'Production Manager', company: 'Bharat Fabricators', text: 'Tracking worker tasks and job status in real-time has eliminated production confusion across shift changes.' },
            { name: 'Sunil Verma', role: 'Workshop Supervisor', company: 'Precision Engineers', text: 'Instant GST quotation generation saves hours every week. A must-have tool for MSME units.' },
          ].map(t => (
            <GlassCard key={t.name} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-glass italic leading-relaxed">"{t.text}"</p>
              <div className="border-t border-glass/10 pt-3">
                <h4 className="text-xs font-bold text-highlight">{t.name}</h4>
                <p className="text-[10px] text-glass-dim">{t.role} — {t.company}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <GlassCard className="p-10 space-y-6 border-glass-bright bg-white/5 shadow-glass-lg">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-sora gradient-text-bright">
            Ready to Modernize Your Manufacturing Business?
          </h2>
          <p className="text-sm text-glass max-w-xl mx-auto">
            Join the next generation of manufacturing MSMEs using Mistry Gems to simplify workflows, improve collaboration, and accelerate business growth.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <GlowButton size="lg" onClick={() => navigate('/login')}>
              Start Free Trial
            </GlowButton>
            <GlowButton variant="outline" size="lg" onClick={() => navigate('/login')}>
              Schedule Demo
            </GlowButton>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass/10 py-12 px-6 text-xs text-glass-dim">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center">
              <Gem size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-highlight font-sora">Mistry Gems</p>
              <p className="text-[10px]">Workflow Management Platform</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Mistry Gems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
