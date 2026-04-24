import { motion } from "framer-motion";
import { 
  Layout, 
  MousePointer2, 
  Zap, 
  Shield, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: <MousePointer2 className="w-6 h-6" />,
    title: "Smooth Drag & Drop",
    description: "Intuitive interface to organize tasks across columns with zero friction.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Task Management",
    description: "Create, edit, and categorize tasks with tags, priorities, and deadlines.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Updates",
    description: "Collaborate instantly with team members with live syncing technology.",
    color: "from-orange-500 to-yellow-500"
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Clean UI/UX",
    description: "A minimal, distraction-free environment designed for maximum productivity.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Reliable Stability",
    description: "Built for performance and reliability, ensuring your data is always accessible.",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Productivity First",
    description: "Designed to help you focus on what matters and get more done in less time.",
    color: "from-rose-500 to-orange-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: Real-time Collaboration
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                Master Your Workflow with <span className="text-indigo-500">Precision.</span>
              </h1>
              <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
                Streamline your projects, collaborate with your team, and stay organized with the most intuitive Kanban experience built for modern creators.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/signup" 
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-xl shadow-indigo-500/25"
                >
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/10">
                  View Demo
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full -z-10" />
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50 bg-[#0a0a0a]">
                <img 
                  src="/landing-preview.png" 
                  alt="Kanban Board Preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">128% Increase</p>
                    <p className="text-xs text-gray-400">Team productivity boost</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 lg:py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-indigo-500 font-semibold text-sm tracking-wider uppercase mb-3">Overview</h2>
            <h3 className="text-3xl lg:text-5xl font-bold mb-6">What is KanbanBoard?</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              KanbanBoard is a visual project management tool designed to help you organize work, limit work-in-progress, and maximize efficiency. It's more than just columns and cards—it's your command center.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                {[
                  { title: "Visualize Everything", desc: "Get a high-level view of your entire project roadmap at a single glance." },
                  { title: "Identify Bottlenecks", desc: "Easily see where tasks are piling up and optimize your team's flow." },
                  { title: "Flexible Workflows", desc: "Custom columns and tags that adapt to your unique way of working." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 mt-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl border border-white/5 bg-gradient-to-br from-white/10 to-transparent p-1">
              <div className="rounded-[14px] overflow-hidden bg-[#0a0a0a]">
                <img 
                  src="/landing-preview.png" 
                  alt="Overview Illustration" 
                  className="w-full h-auto opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-indigo-500 font-semibold text-sm tracking-wider uppercase mb-3">Features</h2>
            <h3 className="text-3xl lg:text-5xl font-bold">Powerful tools for elite teams.</h3>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.05]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why This Project Section */}
      <section id="why" className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-balance leading-tight">
            Built for Stability, Not Just for Free Hosting.
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Most projects disappear when free hosting tiers expire or servers go down. I've built KanbanFlow on a robust architecture designed for 99.9% uptime and data integrity. Your projects are too important to be hosted on shaky ground.
          </p>
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20">
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-indigo-400 mb-1">99.9%</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-400 mb-1">256-bit</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Encryption</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-400 mb-1">Infinite</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Scalability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Layout className="w-6 h-6 text-indigo-500" />
              <span className="text-xl font-bold">KanbanFlow</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 KanbanFlow. All rights reserved. Professional project management.
            </p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
