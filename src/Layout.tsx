import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, LogIn, Github, MessageSquare, ChevronUp, Menu, X, Home, ShoppingBag, Users, HelpCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useAppContext } from './AppContext';
import { DiscordIcon, YoutubeIcon, InstagramIcon } from './components/Icons';
import ErrorBanner from './components/ErrorBanner';

export default function Layout() {
  const { isLoggedIn, user, login, logout, authError, setAuthError } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ipCopied, setIpCopied] = useState(false);
  const [footerIpCopied, setFooterIpCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        login(event.data.user);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  React.useEffect(() => {
    const checkLocalStorage = () => {
      const stored = localStorage.getItem('vixel_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.username && !isLoggedIn) {
            login(parsed);
          }
        } catch (e) {}
      }
    };

    checkLocalStorage();
    window.addEventListener('storage', checkLocalStorage);
    const interval = setInterval(checkLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      clearInterval(interval);
    };
  }, [isLoggedIn, login]);

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = authUsername.trim();

    if (!username) {
      setAuthStatus('Please enter your Discord username.');
      return;
    }

    setIsAuthSubmitting(true);
    setAuthStatus(null);

    try {
      const response = await fetch('/api/auth/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to continue with this username.');
      }

      login(data.user);
      setShowAuthModal(false);
      setAuthUsername('');
      setAuthStatus(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to continue.';
      setAuthStatus(message);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthUsername('');
    setAuthStatus(null);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Store', path: '/store', icon: ShoppingBag },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-mc-dark text-white font-sans selection:bg-mc-purple/30">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <ErrorBanner message={authError} onClose={() => setAuthError(null)} />
      </div>
      {/* Navigation Bar */}
      <nav className="bg-[#09070D]/95 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 shadow-lg shadow-[#09070D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to="/" className="flex items-center py-2">
                <img src="/logo.png" alt="Vixel Logo" className="h-14 md:h-18 w-auto object-contain transition-transform hover:scale-105" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium h-full">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`hover:text-white transition-all relative h-full flex items-center space-x-2 group ${location.pathname === link.path ? 'text-white font-semibold' : 'text-gray-400'}`}
                  >
                    <IconComponent size={16} className={`${location.pathname === link.path ? 'text-mc-orange scale-110' : 'text-gray-400 group-hover:text-white group-hover:scale-110'} transition-all duration-300`} />
                    <span>{link.name}</span>
                    {location.pathname === link.path && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-mc-orange to-mc-purple rounded-t-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-6 relative">
              {/* Copy IP Badge */}
              <div
                onClick={() => {
                  navigator.clipboard.writeText('play.vixelnetwork.online');
                  setIpCopied(true);
                  setTimeout(() => setIpCopied(false), 2000);
                }}
                className="hidden lg:flex items-center space-x-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-mc-orange/30 px-4 py-2 rounded-2xl text-xs font-semibold select-none cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 group shadow-md shadow-black/20"
              >
                <span className={`w-2 h-2 rounded-full ${ipCopied ? 'bg-green-500 animate-ping' : 'bg-green-400 animate-pulse'}`}></span>
                <span className="text-gray-400 font-sans tracking-wide">IP:</span>
                <span className="text-white font-mono tracking-wider">play.vixelnetwork.online</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md transition-colors duration-200 ${
                  ipCopied ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-mc-orange/10 text-mc-orange border border-mc-orange/20 group-hover:bg-mc-orange/20'
                }`}>
                  {ipCopied ? 'Copied!' : 'Copy'}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors focus:outline-none flex items-center justify-center"
                >
                  <Settings size={22} className="text-gray-300 hover:text-white" />
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-56 bg-mc-black border border-gray-800 rounded-3xl overflow-hidden shadow-xl z-50">
                    <Link
                      to="/create-announcement"
                      className="block px-6 py-4 hover:bg-gray-800 text-sm transition-colors border-b border-gray-800"
                      onClick={() => setShowSettings(false)}
                    >
                      Create Announcement!
                    </Link>
                    <Link
                      to="/news-collection"
                      className="block px-6 py-4 hover:bg-gray-800 text-sm transition-colors border-b border-gray-800"
                      onClick={() => setShowSettings(false)}
                    >
                      News Collection
                    </Link>
                    {isLoggedIn && (
                      <button
                        onClick={() => { logout(); setShowSettings(false); }}
                        className="w-full text-left px-6 py-4 hover:bg-gray-800 text-sm transition-colors text-red-500 font-semibold uppercase tracking-wide"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!isLoggedIn ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-mc-orange text-white px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse hover:animate-none transition-all text-xs"
                >
                  Login/Register
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-2xl">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-7 h-7 rounded-full border border-white/20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-mc-purple/50 flex items-center justify-center text-xs font-bold text-white">
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-white tracking-wide">{user?.username}</span>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#09070D] border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent size={18} className="text-gray-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {!isLoggedIn ? (
                <div className="px-3 py-2.5 text-base font-medium text-gray-400">
                  Logged Out
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border border-white/20 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-mc-purple/50 flex items-center justify-center text-xs font-bold text-white">
                        {user?.username?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-base font-semibold text-white">{user?.username}</span>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold uppercase tracking-wide text-red-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors">
                    <LogIn size={18} className="text-red-400 rotate-180" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#09070D]/95 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mc-orange">Vixel Network</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Sign in or Register</h2>
                <p className="mt-2 text-sm text-gray-400">Enter your Discord username to continue. Each username can be active on one device at a time.</p>
              </div>
              <button
                onClick={closeAuthModal}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="discord-username" className="mb-2 block text-sm font-medium text-gray-300">
                  Discord Username
                </label>
                <input
                  id="discord-username"
                  type="text"
                  value={authUsername}
                  onChange={(event) => setAuthUsername(event.target.value)}
                  placeholder="your_discord_name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-mc-orange/50 focus:ring-2 focus:ring-mc-orange/30"
                />
              </div>

              {authStatus && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {authStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className="w-full rounded-full bg-mc-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAuthSubmitting ? 'Please wait...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#09070D] border-t border-white/5 pt-16 pb-12 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-mc-orange/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-mc-purple/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col space-y-5">
              <div>
                <img src="/logo.png" alt="Vixel Logo" className="h-16 w-auto object-contain transition-transform hover:scale-105" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Experience the best Minecraft server with custom gamemodes, active community, and endless fun.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="https://www.youtube.com/@Vixelbhaivsgamer" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#FF0000]/10 hover:text-[#FF0000] hover:border-[#FF0000]/30 transition-all" title="YouTube"><YoutubeIcon size={18} /></a>
                <a href="https://discord.gg/GDTsV7ttJZ" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2]/30 transition-all" title="Discord"><DiscordIcon size={18} /></a>
                <a href="https://www.instagram.com/vixel_bhai_vs_gamer/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all" title="Instagram"><InstagramIcon size={18} /></a>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5 inline-block">Explore</h4>
              <ul className="space-y-3.5 text-sm">
                {navLinks.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link to={link.path} className="flex items-center space-x-2.5 text-gray-400 hover:text-white transition-colors group">
                        <LinkIcon size={14} className="text-gray-500 group-hover:text-mc-orange transition-colors" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5 inline-block">Support</h4>
              <ul className="space-y-3.5 text-sm text-gray-400">
                <li>
                  <Link to="/support" className="flex items-center space-x-2.5 hover:text-white transition-colors group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-mc-purple transition-colors"></span>
                    <span>Support Center</span>
                  </Link>
                </li>
                <li>
                  <a href="https://discord.gg/GDTsV7ttJZ" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 hover:text-white transition-colors group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-mc-purple transition-colors"></span>
                    <span>Create a Ticket</span>
                  </a>
                </li>
                <li>
                  <button onClick={scrollToTop} className="flex items-center space-x-2.5 hover:text-white transition-colors group text-left cursor-pointer">
                    <ChevronUp size={14} className="text-gray-500 group-hover:text-mc-purple transition-colors" />
                    <span>Back to Top</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Server Status / Connect */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5 inline-block self-start">Play VixelMC</h4>
              <div className="space-y-3">
                <div
                  onClick={() => {
                    navigator.clipboard.writeText('play.vixelnetwork.online');
                    setFooterIpCopied(true);
                    setTimeout(() => setFooterIpCopied(false), 2000);
                  }}
                  className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-3 cursor-pointer transition-all duration-300 group hover:border-mc-orange/30"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Server Address</span>
                    <span className="text-xs text-white font-mono tracking-wider font-semibold">play.vixelnetwork.online</span>
                  </div>
                  <div className="p-1.5 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                    {footerIpCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-2.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-medium">Java & Bedrock Supported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
            <div>
              &copy; {new Date().getFullYear()} VixelMC Network. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="hover:text-white transition-colors">Version 1.20.x</span>
              <span>•</span>
              <span className="hover:text-white transition-colors">Not affiliated with Mojang Studios</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}