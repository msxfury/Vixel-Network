import React from 'react';
import { ExternalLink, MessageSquare, Twitter, Music, Send } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { DiscordIcon, YoutubeIcon, InstagramIcon, GithubIcon } from '../components/Icons';

const parseMarkdown = (text: string) => {
  // Bold: **text**
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Big Title: # Title
  parsed = parsed.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-mc-purple my-4">$1</h1>');
  // Cursive: *text*
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Links
  parsed = parsed.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-mc-purple hover:underline">$1</a>');
  // Newlines
  parsed = parsed.replace(/\n/g, '<br/>');
  return parsed;
};

export default function Community() {
  const { announcements } = useAppContext();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">Community Hub</h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">Connect with us across all our platforms and stay updated with the latest news.</p>
      </div>

      {/* Social Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {/* YouTube */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-[#FF0000]/30 hover:shadow-[0_0_40px_rgba(255,0,0,0.15)] group hover:-translate-y-1">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-white/5 mb-4 group-hover:bg-[#FF0000]/10 transition-colors">
              <YoutubeIcon size={32} className="text-gray-400 group-hover:text-[#FF0000] transition-colors" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-200 group-hover:text-white transition-colors mb-2">YouTube</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Watch server trailers, gameplay videos, and guide playlists.</p>
          </div>
          <a 
            href="https://www.youtube.com/@Vixelbhaivsgamer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-[#FF0000] hover:bg-[#D00000] transition-colors shadow-lg shadow-[#FF0000]/10 flex items-center justify-center gap-2"
          >
            <YoutubeIcon size={16} />
            Subscribe
          </a>
        </div>

        {/* Discord */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-[#5865F2]/30 hover:shadow-[0_0_40px_rgba(88,101,242,0.15)] group hover:-translate-y-1">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-white/5 mb-4 group-hover:bg-[#5865F2]/10 transition-colors">
              <DiscordIcon size={32} className="text-gray-400 group-hover:text-[#5865F2] transition-colors" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-200 group-hover:text-white transition-colors mb-2">Discord</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Join our active server, chat with developers, and get instant updates.</p>
          </div>
          <a 
            href="https://discord.gg/GDTsV7ttJZ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] transition-colors shadow-lg shadow-[#5865F2]/10 flex items-center justify-center gap-2"
          >
            <DiscordIcon size={16} />
            Visit
          </a>
        </div>

        {/* Instagram */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-[#E1306C]/30 hover:shadow-[0_0_40px_rgba(225,48,108,0.15)] group hover:-translate-y-1">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-white/5 mb-4 group-hover:bg-[#E1306C]/10 transition-colors">
              <InstagramIcon size={32} className="text-gray-400 group-hover:text-[#E1306C] transition-colors" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-200 group-hover:text-white transition-colors mb-2">Instagram</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Check out our latest community snapshots, story highlights, and server reels.</p>
          </div>
          <a 
            href="https://www.instagram.com/vixel_bhai_vs_gamer/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:brightness-110 transition-all shadow-lg shadow-[#E1306C]/10 flex items-center justify-center gap-2"
          >
            <InstagramIcon size={16} />
            Follow
          </a>
        </div>
      </div>

      {/* News Feed */}
      <div>
        <h2 className="text-3xl font-display font-bold mb-10 pb-6 border-b border-white/10 flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-mc-orange"></span>
          <span>Latest Announcements</span>
        </h2>
        
        <div className="space-y-8">
          {announcements.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10">
              <p className="text-lg text-gray-500 font-medium">No announcements yet.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm transition-all hover:border-white/20">
                {ann.banner && (
                  <div className="h-64 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-mc-dark to-transparent z-10"></div>
                    <img src={ann.banner} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${ann.tag === 'Announcement' ? 'bg-mc-orange/20 text-mc-orange border border-mc-orange/30' : ''}
                      ${ann.tag === 'Event' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                      ${ann.tag === 'Alert' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                    `}>
                      {ann.tag}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {new Date(ann.timestamp).toLocaleString(undefined, {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold text-white mb-6 tracking-tight">{ann.title}</h3>
                  
                  <div 
                    className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-a:text-mc-orange max-w-none text-base leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(ann.description) }}
                  />

                  {ann.links && (
                    <div className="pt-8 border-t border-white/10">
                      <h4 className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-wider">Related Links</h4>
                      <div className="flex flex-wrap gap-4">
                        {ann.links.split(',').map((link, idx) => {
                          const url = link.trim();
                          if (!url) return null;
                          let Icon = ExternalLink;
                          let label = url;
                          let brandClass = "hover:text-mc-purple";
                          
                          if (url.includes('discord.gg') || url.includes('discord.com')) { Icon = DiscordIcon; label = 'Discord'; brandClass = "hover:text-[#5865F2]"; }
                          else if (url.includes('instagram.com')) { Icon = InstagramIcon; label = 'Instagram'; brandClass = "hover:text-[#E1306C]"; }
                          else if (url.includes('youtube.com')) { Icon = YoutubeIcon; label = 'YouTube'; brandClass = "hover:text-[#FF0000]"; }
                          else if (url.includes('github.com')) { Icon = GithubIcon; label = 'GitHub'; brandClass = "hover:text-gray-300"; }
                          else if (url.includes('twitter.com') || url.includes('x.com')) { Icon = Twitter; label = 'Twitter'; brandClass = "hover:text-[#1DA1F2]"; }
                          else if (url.includes('tiktok.com')) { Icon = Music; label = 'TikTok'; brandClass = "hover:text-[#00F2EA]"; }
                          else if (url.includes('t.me') || url.includes('telegram.me')) { Icon = Send; label = 'Telegram'; brandClass = "hover:text-[#0088CC]"; }

                          
                          // Ensure url has protocol for href
                          const href = url.startsWith('http') ? url : `https://${url}`;

                          return (
                            <a 
                              key={idx} 
                              href={href} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:bg-white/10 ${brandClass} text-sm font-medium`}
                            >
                              <Icon size={16} />
                              <span>{label}</span>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
