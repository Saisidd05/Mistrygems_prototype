import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Heart,
  LayoutDashboard,
  PieChart,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Job Management',
    description: 'Create, assign and monitor jobs across every production stage with intelligent status tracking.',
  },
  {
    icon: ClipboardList,
    title: 'Quotation Management',
    description: 'Generate fast quotes, share approvals, and keep pricing transparent from request to delivery.',
  },
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Manage teams, roles, and workload with a clean view of assignments and capacity.',
  },
  {
    icon: CheckCircle2,
    title: 'Task Assignment',
    description: 'Assign jobs with priorities, deadlines and rich status updates for every team member.',
  },
  {
    icon: Activity,
    title: 'Workflow Tracking',
    description: 'Track every stage from pending to delivered with a timeline built for manufacturing.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Visual dashboards deliver KPIs, operational insights and performance trends.',
  },
]

const processSteps = [
  'Customer Request',
  'Create Job',
  'Generate Quotation',
  'Assign Employee',
  'Track Progress',
  'Quality Check',
  'Completed',
  'Delivered',
]

const stats = [
  { label: '100+ Jobs Managed', value: '100+' },
  { label: '95% Workflow Visibility', value: '95%' },
  { label: '40% Faster Coordination', value: '40%' },
  { label: 'Real-Time Status Tracking', value: 'Live' },
]

const benefits = [
  'Digitize Operations',
  'Reduce Manual Work',
  'Improve Team Collaboration',
  'Track Every Job',
  'Increase Productivity',
  'Drive Business Growth',
]

const testimonials = [
  {
    name: 'Asha Patel',
    role: 'Manufacturing Owner',
    quote: 'Mistry Gems transformed our order flow in weeks—no more spreadsheets, no more missed handoffs.',
  },
  {
    name: 'Rohit Mehra',
    role: 'Production Manager',
    quote: 'Workflow visibility is now instant. Teams collaborate faster, and delivery targets are clearer.',
  },
  {
    name: 'Neha Kapoor',
    role: 'Workshop Supervisor',
    quote: 'The premium dashboard feels effortless, and the team loves the modern controls.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#2A1B3D] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,63,135,0.24),transparent_24%),radial-gradient(circle_at_80%_15%,rgba(233,128,116,0.2),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(68,49,141,0.22),transparent_24%)]" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#44318D]/20 blur-3xl animate-blob" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#D83F87]/25 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-4 top-48 h-80 w-80 rounded-full bg-[#E98074]/20 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>

      <main className="relative px-6 py-10 sm:px-8 lg:px-12">
        <section className="mx-auto max-w-[1440px] space-y-16 py-10 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 backdrop-blur-xl shadow-[0_24px_80px_rgba(68,49,141,0.12)]">
                <Sparkles className="h-4 w-4 text-pink-300" />
                Premium manufacturing workflow platform for MSMEs
              </motion.div>

              <motion.div variants={fadeUp} className="max-w-2xl space-y-6">
                <p className="text-sm uppercase tracking-[0.36em] text-[#E98074]">Mistry Gems</p>
                <h1 className="text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Manage Manufacturing Workflows Smarter with <span className="bg-gradient-to-r from-[#D83F87] via-[#E98074] to-[#44318D] bg-clip-text text-transparent">Mistry Gems</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-300 sm:text-xl">
                  A modern workflow management platform built for MSMEs to streamline jobs, quotations, task assignments, workflow tracking, and business operations from one centralized dashboard.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#44318D] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(68,49,141,0.24)] transition hover:brightness-110"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Demo
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <GlassCard className="p-4 bg-white/10 border-white/10 shadow-none backdrop-blur-sm" glow="rose">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-2xl bg-[#44318D]/20 p-3 text-[#44318D]">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Workflow</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-100">
                    High-level pipeline view that keeps every team member aligned.
                  </p>
                </GlassCard>
                <GlassCard className="p-4 bg-white/10 border-white/10 shadow-none backdrop-blur-sm" glow="rose">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-2xl bg-[#D83F87]/15 p-3 text-[#D83F87]">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Quotations</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-100">Instant quote creation, approval workflows, and margin controls.</p>
                </GlassCard>
                <GlassCard className="p-4 bg-white/10 border-white/10 shadow-none backdrop-blur-sm" glow="rose">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-2xl bg-[#E98074]/15 p-3 text-[#E98074]">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Team</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-100">Assign people, roles and deadlines with elegant transparency.</p>
                </GlassCard>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-lg"
            >
              <div className="absolute inset-x-0 top-1/2 -z-10 h-72 rounded-full bg-[#D83F87]/15 blur-3xl" />
              <GlassCard className="p-6 shadow-[0_40px_100px_rgba(68,49,141,0.16)]">
                <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Preview</span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">+16% efficiency</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">Central production dashboard</h2>
                    <p className="text-sm text-slate-300">A sleek view of jobs, deadlines, and approval activity designed for manufacturing leaders.</p>
                    <div className="rounded-3xl border border-white/10 bg-[#0f0c1c]/70 p-4">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-300">Pending Jobs</span>
                        <strong className="text-lg text-white">18</strong>
                      </div>
                      <div className="grid gap-3">
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#D83F87] to-[#E98074]" />
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-full w-5/6 rounded-full bg-gradient-to-r from-[#44318D] to-[#D83F87]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                    <div className="rounded-3xl border border-white/10 bg-[#1F1535]/80 p-4">
                      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                        <span>Job status</span>
                        <span>82%</span>
                      </div>
                      <div className="grid gap-3">
                        {['Pending', 'In Progress', 'Completed'].map((label, index) => (
                          <div key={label} className="grid gap-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>{label}</span>
                              <span>{['24%', '38%', '18%'][index]}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10">
                              <div className={`h-full rounded-full ${['w-1/4 bg-[#D83F87]', 'w-3/8 bg-[#E98074]', 'w-1/5 bg-[#44318D]'][index]}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-[#1F1535]/80 p-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Notifications</span>
                        <span className="text-[#E98074]">3 new</span>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <p>Quotation approved for order #1124.</p>
                        <p>Task deadline approaching for Heat Treat batch.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
              <motion.div variants={fadeUp} className="glass-card p-10 border-white/15 bg-[#1D1432]/90 shadow-[0_28px_80px_rgba(68,49,141,0.14)]">
                <span className="text-sm uppercase tracking-[0.35em] text-[#E98074]">About Mistry Gems</span>
                <h2 className="mt-4 text-3xl font-semibold text-white">A premium workflow platform built to replace spreadsheets, WhatsApp threads, and hand-written notes.</h2>
                <p className="mt-4 max-w-xl text-slate-300">Mistry Gems helps manufacturing MSMEs digitize their operations by replacing manual workflows such as WhatsApp, spreadsheets, notebooks, and phone calls with one centralized workflow management platform.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {['Customer', 'Job', 'Task', 'Completion'].map((label) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                      <span className="block text-xs uppercase tracking-[0.32em] text-slate-400">{label}</span>
                      <span className="mt-2 block text-lg font-semibold text-white">→</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <GlassCard key={item.label} className="p-6 border-white/15 bg-[#1C1331]/90" glow="rose">
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-3 text-sm text-slate-300">{item.label}</p>
                  </GlassCard>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.7 } }} className="space-y-8">
              <h2 className="text-3xl font-semibold text-white">Core features designed around manufacturing workflows</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <GlassCard key={feature.title} className="p-6 border-white/10 bg-[#1A1028]/85" glow="rose">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#44318D]/20 text-[#D83F87]">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                        <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </section>

          <section className="space-y-12">
            <motion.div initial={fadeUp.hidden} animate={fadeUp.visible} className="glass-card p-12 border-white/15 bg-[#1E1533]/90 text-center shadow-[0_28px_90px_rgba(68,49,141,0.16)]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#E98074]">Platform Motto</p>
              <h2 className="mt-6 text-4xl font-semibold text-white leading-tight">Simplify Operations.<br />Improve Collaboration.<br />Accelerate Productivity.</h2>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard className="p-8 border-white/15 bg-[#1A1028]/90">
                <h3 className="text-xl font-semibold text-white">Workflow Process</h3>
                <div className="mt-8 space-y-5">
                  {processSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${index % 2 === 0 ? 'bg-[#D83F87]/20 text-[#D83F87]' : 'bg-[#E98074]/20 text-[#E98074]'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{step}</p>
                        <p className="text-xs text-slate-400">{index === 0 ? 'Customer request enters platform' : index === processSteps.length - 1 ? 'Order delivered to customer' : 'Automated workflow step'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-8 border-white/15 bg-[#1A1028]/90">
                <h3 className="text-xl font-semibold text-white">Why Choose Mistry Gems</h3>
                <div className="mt-8 grid gap-3">
                  {['Built for MSMEs', 'Modern glass UI', 'Real-time insights', 'Fast onboarding', 'Affordable alternative'].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/10 bg-[#291B3D]/80 px-4 py-3 text-sm text-slate-200">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-[#E98074]" />
                        <span>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white">Business Benefits</h2>
              <p className="max-w-2xl text-slate-300">A workflow platform that helps manufacturing operations remove friction, accelerate collaboration, and make every delivery predictable.</p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="flex items-start gap-4 rounded-3xl border border-white/10 bg-[#1A1028]/80 p-5"
                  >
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#44318D]/20 text-[#E98074]">
                      <Zap className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-white">{benefit}</p>
                      <p className="text-sm text-slate-400">A smooth manufacturing workflow reduces manual effort and grows capacity.</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <GlassCard className="p-8 border-white/15 bg-[#1A1028]/90">
              <h3 className="text-xl font-semibold text-white">Dashboard Preview</h3>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {['Recent Jobs', 'Pending Tasks', "Today's Deadlines", 'Employee Performance'].map((title) => (
                    <div key={title} className="rounded-3xl border border-white/10 bg-[#291B3D]/80 p-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-2 text-3xl text-[#D83F87]">{title === 'Recent Jobs' ? '24' : title === 'Pending Tasks' ? '8' : title === "Today's Deadlines" ? '4' : '92%'} </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[32px] border border-white/10 bg-[#120B20]/85 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Analytics</span>
                    <span>Live</span>
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    {[85, 62, 74, 98, 56].map((percent, index) => (
                      <div key={index} className="flex-1">
                        <div className="h-28 rounded-full bg-white/5" style={{ height: `${percent / 1.2}%` }} />
                        <p className="mt-2 text-center text-[11px] text-slate-500">W{index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-[#291B3D]/85 p-4 text-sm text-slate-300">
                  <p className="text-sm font-semibold text-white">Workflow status</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-3xl bg-[#44318D]/15 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">In Progress</p>
                      <p className="mt-2 text-lg font-semibold text-white">54%</p>
                    </div>
                    <div className="rounded-3xl bg-[#D83F87]/15 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Completed</p>
                      <p className="mt-2 text-lg font-semibold text-white">28%</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#E98074]">Testimonials</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Trusted by manufacturing teams that want a premium experience.</h2>
              </div>
              <p className="max-w-xl text-sm text-slate-300">Our customers choose Mistry Gems because it feels modern, easy to use, and built for real production workflows.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {testimonials.map((item, index) => (
                <GlassCard key={item.name} className="p-6 border-white/10 bg-[#1A1028]/90" glow="rose">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.role}</p>
                    </div>
                    <div className="rounded-3xl bg-[#44318D]/20 px-3 py-2 text-sm text-[#D83F87]">★★★★★</div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-300">{item.quote}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          <section className="rounded-[38px] border border-white/10 bg-[#231536]/90 p-10 shadow-[0_40px_120px_rgba(68,49,141,0.18)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#E98074]">Ready to digitize</p>
                <h2 className="mt-4 text-4xl font-semibold text-white">Ready to Digitize Your Manufacturing Workflow?</h2>
                <p className="mt-4 max-w-xl text-slate-300">Join thousands of MSMEs transforming their operations with Mistry Gems.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link className="inline-flex items-center justify-center rounded-full bg-[#44318D] px-6 py-3 font-semibold text-white shadow-[0_20px_40px_rgba(68,49,141,0.2)] transition hover:brightness-110" to="/signup">
                  Start Free Trial
                </Link>
                <Link className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10" to="/login">
                  Book Demo
                </Link>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 pt-8 text-slate-400">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <p className="text-xl font-semibold text-white">Mistry Gems</p>
                <p className="mt-3 max-w-sm text-sm text-slate-400">Workflow Management Platform for Manufacturing MSMEs.</p>
              </div>
              <div className="grid gap-2 text-sm">
                <p className="font-semibold text-white">Quick Links</p>
                <Link className="text-slate-400 transition hover:text-white" to="/">Product</Link>
                <Link className="text-slate-400 transition hover:text-white" to="/">Features</Link>
                <Link className="text-slate-400 transition hover:text-white" to="/">Pricing</Link>
              </div>
              <div className="grid gap-2 text-sm">
                <p className="font-semibold text-white">Support</p>
                <Link className="text-slate-400 transition hover:text-white" to="/login">Contact</Link>
                <Link className="text-slate-400 transition hover:text-white" to="/login">Help</Link>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>© 2026 Mistry Gems. All rights reserved.</span>
              <span>Designed for modern manufacturing teams.</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}
