
import React, { useState } from 'react';
import { 
  Handshake, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ChevronRight, 
  Smartphone,
  CheckCircle2,
  Users,
  X,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';

interface LandingProps {
  onLogin: (email: string, password?: string) => boolean;
  onSignup: (userData: { firstName: string; lastName: string; email: string; password?: string }) => boolean;
}

type AuthMode = 'login' | 'signup';

const FeatureItem: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

const Landing: React.FC<LandingProps> = ({ onLogin, onSignup }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'signup') {
      const success = onSignup({ 
        firstName: formData.firstName, 
        lastName: formData.lastName, 
        email: formData.email, 
        password: formData.password 
      });
      if (!success) {
        setAuthError("An account with this email already exists.");
      }
    } else {
      const success = onLogin(formData.email, formData.password);
      if (!success) {
        setAuthError("No account found with these credentials.");
      }
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Auth Modal Overlay */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsAuthModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-8">
                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
                  <span className="text-white font-black text-xl">B</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {authMode === 'login' ? 'Welcome back' : 'Join BrokerFLOW'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {authMode === 'login' ? 'Enter your details to access your deals' : 'Start your 14-day free trial today'}
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 text-sm font-medium animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Last Name</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="jane@brokerage.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        required
                        type="tel" 
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-2"
                >
                  {authMode === 'login' ? 'Log In to Dashboard' : 'Create My Account'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  {authMode === 'login' ? "Don't have an account?" : "Already using BrokerFLOW?"}
                  <button 
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setAuthError(null);
                    }}
                    className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {authMode === 'login' ? 'Sign up for free' : 'Log in here'}
                  </button>
                </p>
                {authMode === 'login' && (
                  <p className="mt-4 text-[10px] text-slate-400 font-medium">
                    Try the demo account: <span className="text-indigo-600 font-bold">demo@brokerflow.com</span> / <span className="text-indigo-600 font-bold">password</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">Broker<span className="text-indigo-600">FLOW</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => openAuth('login')}
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 px-4 py-2 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => openAuth('signup')}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 animate-bounce">
            <Zap className="h-3 w-3" />
            V2.5 is now live with AI Commission Parsing
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Close faster. Track smarter. <br />
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Flow with confidence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            The ultimate transaction suite for modern real estate agents. Automate your financials, track contingencies in real-time, and scale your business with ease.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
            >
              Start Your Free Trial
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onLogin('demo@brokerflow.com', 'password')}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Try Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by agents at top brokerages</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-125">
               <span className="text-2xl font-black tracking-tighter">COMPASS</span>
               <span className="text-2xl font-black tracking-tighter">RE/MAX</span>
               <span className="text-2xl font-black tracking-tighter">ZILLOW</span>
               <span className="text-2xl font-black tracking-tighter">REDWELL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Everything you need to scale.</h2>
            <p className="text-slate-500 max-w-md mx-auto">Powerful tools designed for the demands of high-volume real estate professionals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureItem 
              icon={Handshake} 
              title="Transaction Management" 
              description="Track escrows, manage contingencies, and keep stakeholders informed with zero friction."
            />
            <FeatureItem 
              icon={Zap} 
              title="AI Commission Parsing" 
              description="Simply upload your commission stubs and let our Gemini-powered AI extract your net income and splits automatically."
            />
            <FeatureItem 
              icon={BarChart3} 
              title="Financial Intelligence" 
              description="Monitor YTD production, gross GCI, and net profit with intuitive, high-impact dashboards."
            />
            <FeatureItem 
              icon={ShieldCheck} 
              title="Compliance Guaranteed" 
              description="Store contracts, addenda, and disclosures in a secure, organized environment ready for audit."
            />
            <FeatureItem 
              icon={Smartphone} 
              title="Mobile First" 
              description="Manage your deals from the field. Our responsive suite ensures you never miss a contingency deadline."
            />
            <FeatureItem 
              icon={Users} 
              title="Team Ready" 
              description="Collaboration features designed for teams, from referral tracking to role-based access control."
            />
          </div>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative">
            <div className="absolute top-10 right-10 opacity-10">
              <Zap className="h-64 w-64 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to join the future of real estate?</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Join 5,000+ top-performing agents who have reclaimed 10+ hours a week using BrokerFLOW.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
               <div className="flex flex-col items-center">
                 <span className="text-4xl font-black text-indigo-400">$2.4B</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Volume Tracked</span>
               </div>
               <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
               <div className="flex flex-col items-center">
                 <span className="text-4xl font-black text-indigo-400">98%</span>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Agent Satisfaction</span>
               </div>
            </div>
            <button 
              onClick={() => openAuth('signup')}
              className="bg-white text-slate-900 px-12 py-4 rounded-full font-black text-xl hover:bg-slate-100 transition-all shadow-2xl"
            >
              Start for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-bold text-slate-900">BrokerFLOW</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
          <p className="text-xs text-slate-400">© 2024 BrokerFLOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
