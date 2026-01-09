import { Link } from 'react-router-dom';
import { ArrowRight, Clock, GitBranch, Search, Zap, Brain, Layers, Play, Check, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      {isOpen && (
        <p className="pb-5 text-gray-500 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">ForgeOne</span>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight mb-6">
            A memory system<br />
            <span className="font-semibold">for your work</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ForgeOne captures work as living memory — preserving context, decisions, 
            and continuity — so you never lose track of what you've done or why it mattered.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-lg"
            >
              Start remembering
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 text-gray-600 hover:text-gray-900 transition-colors text-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl text-gray-600 font-light leading-relaxed">
            "ForgeOne does <span className="font-medium text-gray-900">not</span> manage tasks or plans.<br />
            It <span className="font-medium text-gray-900">remembers</span> work."
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Memory over management
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything you need to preserve context and maintain continuity in your work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Work Moments</h3>
              <p className="text-gray-500 leading-relaxed">
                Capture effort as it happens. Track energy, state, and context — not just tasks.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Timeline View</h3>
              <p className="text-gray-500 leading-relaxed">
                See your work unfold chronologically. Grouped by day, organized by outcome.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <GitBranch className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Context Threads</h3>
              <p className="text-gray-500 leading-relaxed">
                Watch patterns emerge naturally. Threads reveal what keeps pulling your attention.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Search className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Instant Recall</h3>
              <p className="text-gray-500 leading-relaxed">
                Find the moment you're thinking about. Search through your entire work memory.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Reflection Insights</h3>
              <p className="text-gray-500 leading-relaxed">
                Lightweight reflections derived from your memory. No charts, just clarity.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Work Entries</h3>
              <p className="text-gray-500 leading-relaxed">
                Log detailed work with categories, time spent, blockers, and outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-16">
            How it works
          </h2>
          
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-lg font-medium">
                1
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Capture your work</h3>
                <p className="text-gray-400 leading-relaxed">
                  Answer one simple prompt: "What effort did you apply?" No forms, no friction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-lg font-medium">
                2
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Watch patterns emerge</h3>
                <p className="text-gray-400 leading-relaxed">
                  Context threads form naturally from repeated effort. No manual organization needed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-lg font-medium">
                3
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Return with context</h3>
                <p className="text-gray-400 leading-relaxed">
                  When you come back to paused work, everything is there — decisions, blockers, progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Built for deep workers
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            ForgeOne is designed for people who work on long-running efforts and value clarity over productivity theater.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['Developers', 'Students', 'Researchers', 'Freelancers', 'Knowledge Workers', 'Creators'].map((user) => (
              <span 
                key={user}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full"
              >
                {user}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshot/Demo */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              See it in action
            </h2>
            <p className="text-gray-500">
              A calm interface designed for reflection, not reaction
            </p>
          </div>
          
          {/* Mock App Screenshot - Dashboard View */}
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded px-3 py-1 text-sm text-gray-400 text-center">
                  forgeone.app/dashboard
                </div>
              </div>
            </div>
            
            {/* App content mock - Dashboard */}
            <div className="p-6">
              {/* App header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <span className="font-semibold text-gray-900">ForgeOne</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-900 font-medium">Dashboard</span>
                  <span className="text-gray-400">Capture</span>
                  <span className="text-gray-400">Timeline</span>
                  <span className="text-gray-400">Threads</span>
                  <span className="text-gray-400">Recall</span>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="grid grid-cols-3 gap-6">
                {/* Main content - Work Entry Form */}
                <div className="col-span-2 space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-1">What did you work on?</h2>
                    <p className="text-sm text-gray-400">Capture your work as memory</p>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Title" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 bg-gray-50"
                      defaultValue="API integration for user dashboard"
                    />
                    <div className="h-20 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
                      Connected the frontend components to the backend API endpoints. Implemented error handling and loading states...
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
                        📁 Project
                      </div>
                      <div className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white">
                        ⏱ 2h 30m
                      </div>
                      <div className="flex-1 px-3 py-2 border-2 border-gray-800 rounded-lg text-sm text-white bg-gray-800">
                        ✓ Done
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar - Recent & Stats */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">This Week</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Entries</span>
                        <span className="font-medium text-gray-800">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time logged</span>
                        <span className="font-medium text-gray-800">18h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Top category</span>
                        <span className="font-medium text-gray-800">Project</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="truncate">Database schema design</div>
                      <div className="truncate">Code review session</div>
                      <div className="truncate">Sprint planning notes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video placeholder */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Play size={20} className="ml-1" />
              </div>
              <span>Watch a 2-minute demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Not another task manager
            </h2>
            <p className="text-gray-500">
              ForgeOne takes a fundamentally different approach
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional tools */}
            <div className="p-8 rounded-2xl bg-gray-50">
              <h3 className="font-medium text-gray-400 mb-6 uppercase text-sm tracking-wide">Traditional Tools</h3>
              <ul className="space-y-4">
                {[
                  'Focus on tasks and deadlines',
                  'Require constant organization',
                  'Track completion, not context',
                  'Create anxiety with notifications',
                  'Forget why decisions were made'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-500">
                    <X size={18} className="mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* ForgeOne */}
            <div className="p-8 rounded-2xl border-2 border-gray-900">
              <h3 className="font-medium text-gray-900 mb-6 uppercase text-sm tracking-wide">ForgeOne</h3>
              <ul className="space-y-4">
                {[
                  'Focus on effort and continuity',
                  'Patterns emerge automatically',
                  'Preserves full context and decisions',
                  'Calm, reflective interface',
                  'Everything is searchable forever'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <Check size={18} className="mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Questions & Answers
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8">
            <FAQItem 
              question="How is this different from a notes app?"
              answer="Notes apps are blank canvases. ForgeOne is structured around effort and time. Every entry captures not just what you did, but how it felt, where you got stuck, and how things connect over time. It's memory with meaning."
            />
            <FAQItem 
              question="Do I need to use it every day?"
              answer="No. ForgeOne is designed to be useful whether you capture work daily or sporadically. The value comes from having context when you return to something — even if that's weeks later."
            />
            <FAQItem 
              question="What are Context Threads?"
              answer="Threads are patterns that emerge from your work. When you keep returning to similar efforts, ForgeOne notices and suggests a thread. They're not projects or tags — they're lines of gravity that show what keeps pulling your attention."
            />
            <FAQItem 
              question="Is my data private?"
              answer="Yes. Your work memory is yours alone. We don't analyze, share, or monetize your data. Everything is encrypted and you can export or delete your data at any time."
            />
            <FAQItem 
              question="Is there a mobile app?"
              answer="Not yet. ForgeOne is currently web-only, optimized for when you're at your computer doing deep work. Mobile is on the roadmap for quick captures on the go."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">
            Start building your work memory
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Free to use. No credit card required.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            Get started for free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-900 font-semibold">ForgeOne</span>
          <p className="text-gray-400 text-sm">
            A memory system for work — designed to preserve effort, context, and continuity over time.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/login" className="hover:text-gray-900">Sign in</Link>
            <Link to="/register" className="hover:text-gray-900">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
