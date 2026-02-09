import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Zap,
  Globe,
  Github,
  Users,
  Palette,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-black text-indigo-600 tracking-tighter italic">
                Linktree<span className="text-gray-900 not-italic">Pro</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-100/50 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
              <Zap className="w-3 h-3 fill-current" />
              <span>Next-Gen Bio Link Platform</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Everything Linktree Pro does, <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
                completely free.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-10">
              Showcase your social media, personal projects, and portfolio with
              a beautiful, high-performance bio link. Designed for developers
              and creators who demand more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center group"
              >
                Create Your Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                View Examples
              </a>
            </div>

            {/* Mockup Preview */}
            <div className="mt-20 relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent z-10" />
              <div className="rounded-3xl shadow-2xl overflow-hidden border border-gray-100 bg-white transform rotate-1 hover:rotate-0 transition-transform duration-700">
                <div className="h-8 bg-gray-50 flex items-center px-4 space-x-2 border-b border-gray-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="flex-1 text-[10px] text-center text-gray-400 font-mono">
                    linktree.pro/alex_dev
                  </div>
                </div>
                <div className="aspect-video bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] bg-size-[16px_16px]" />
                  <div className="relative z-20 text-indigo-600 font-black text-4xl">
                    DASHBOARD PREVIEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Power Features Included
              </h2>
              <p className="text-gray-600">
                We don't gate features behind subscriptions. You get it all.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Advanced Analytics",
                  desc: "Track views, clicks, and geographic location with detailed charts.",
                  icon: BarChart3,
                  color: "bg-blue-500",
                },
                {
                  title: "A/B Testing",
                  desc: "Test different titles and layouts to see what converts better.",
                  icon: ShieldCheck,
                  color: "bg-purple-500",
                },
                {
                  title: "GitHub Integration",
                  desc: "Automatically sync stars, language, and metadata for your projects.",
                  icon: Github,
                  color: "bg-gray-900",
                },
                {
                  title: "Custom Themes",
                  desc: "Full design control with custom colors, fonts, and gradients.",
                  icon: Palette,
                  color: "bg-pink-500",
                },
                {
                  title: "Team Collaboration",
                  desc: "Invite editors and manage profiles together with RBAC.",
                  icon: Users,
                  color: "bg-indigo-500",
                },
                {
                  title: "Webhooks",
                  desc: "Connect to 1000+ apps with enterprise-grade event webhooks.",
                  icon: Zap,
                  color: "bg-amber-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section (Fake) */}
        <section
          id="pricing"
          className="py-24 bg-white relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-indigo-600 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle2 className="w-64 h-64 text-white" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 italic tracking-tighter">
                リンクツリー<span className="not-italic">プロ</span>
              </h2>
              <p className="text-indigo-100 text-xl mb-12 max-w-lg mx-auto font-medium">
                Tired of paying $10/month for basic branding features? We offer
                the full Pro experience with 0 restrictions.
              </p>
              <div className="flex flex-col items-center">
                <div className="text-6xl font-black text-white mb-2">$0</div>
                <div className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-12">
                  Total, Forever.
                </div>
                <Link
                  href="/register"
                  className="px-12 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Claim Your Handle Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-black italic">
              LP
            </div>
            <span>© 2026 Linktree Pro. Built with Next.js and ❤️</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#" className="hover:text-indigo-600">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-600">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-600">
              DMCA
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 underline decoration-indigo-200 decoration-2 underline-offset-4"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
