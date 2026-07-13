import React, { useEffect, useState } from 'react';
import { MessageSquare, Users, Heart, ArrowRight, Volume2, Trophy, Swords, Sparkles, Coins } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { DiscordIcon } from '../components/Icons';

interface DiscordMember {
  id: string;
  username: string;
  status: 'online' | 'idle' | 'dnd';
  avatar_url: string;
  bot?: boolean;
}

interface DiscordChannel {
  id: string;
  name: string;
  position: number;
}

interface DiscordData {
  presence_count: number;
  members: DiscordMember[];
  channels: DiscordChannel[];
}

export default function Home() {
  const { announcements, isLoading: isAppLoading } = useAppContext();
  const navigate = useNavigate();
  const latestNews = announcements.slice(0, 3); // Get top 3 latest
  
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [isDiscordLoading, setIsDiscordLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://discord.com/api/guilds/1501252184786866408/widget.json')
        .then(res => res.json())
        .then(data => {
          setDiscordData(data);
          setIsDiscordLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch Discord data:', err);
          setIsDiscordLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = isAppLoading || isDiscordLoading;

  // Note: The Discord widget.json API does not expose the "bot" or "APP" tag for privacy reasons.
  // We filter known bot names as a fallback to ensure they don't appear in the online list.
  const humanMembers = discordData?.members?.filter(m => !m.bot && m.username !== 'VIXEL - BotZ' && !m.username.toLowerCase().includes('bot')) || [];

  return (
    <div className="pb-12">
      {/* Hero Banner Section */}
      <div 
        className="relative h-[28rem] w-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/ChatGPT%20Image%20Jul%208,%202026,%2006_08_21%20PM.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-mc-dark backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -12, 0] 
            }}
            transition={{
              opacity: { duration: 1, ease: "easeOut" },
              scale: { duration: 1, ease: "easeOut" },
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }
            }}
            className="relative z-10 flex flex-col items-center justify-center select-none mb-4 translate-y-8"
          >
            {/* Ambient glow behind the logo */}
            <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-mc-orange/20 via-mc-purple/30 to-mc-pink/20 blur-3xl opacity-70 animate-pulse pointer-events-none -z-10"></div>
            
            <motion.img 
              src="/logo.png" 
              alt="Vixel Logo" 
              className="h-44 sm:h-56 md:h-64 lg:h-72 w-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] cursor-pointer"
              whileHover={{ scale: 1.05, filter: "drop-shadow(0 20px 40px rgba(249,115,22,0.5))" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
          </motion.div>
          {/* Discord Widget Overlay inside Hero Background */}
          <div className="mt-2 md:absolute md:bottom-6 md:right-8 md:mt-0 z-20">
            <a 
              href="https://discord.gg/GDTsV7ttJZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-black/40 hover:bg-black/60 border border-white/10 p-3.5 px-5 rounded-2xl transition-all duration-300 hover:scale-105 group select-none shadow-xl shadow-black/30"
            >
              <div className="text-right flex flex-col justify-center">
                <span className="text-[#ff5500] font-sans font-black text-base md:text-lg tracking-wider uppercase leading-none drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
                  {isLoading ? "..." : `${humanMembers.length} ONLINE`}
                </span>
                <span className="text-white font-sans font-extrabold text-sm md:text-base tracking-wide uppercase leading-normal mt-1 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
                  CLICK TO JOIN
                </span>
              </div>
              <div className="text-[#ff5500] hover:text-[#ff3c00] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <DiscordIcon size={44} />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Discord Card */}
            <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-[#5865F2]/10 rounded-xl">
                  <DiscordIcon className="text-[#5865F2]" size={24} />
                </div>
                <h2 className="text-xl font-display font-semibold flex-1">Discord Server</h2>
                {!isDiscordLoading && discordData && (
                  <div className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full uppercase tracking-wider">
                    {humanMembers.length} Online
                  </div>
                )}
              </div>
              
              {isDiscordLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
                    <div className="h-10 bg-white/5 rounded-xl w-full"></div>
                    <div className="h-10 bg-white/5 rounded-xl w-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded w-32 mb-4"></div>
                    <div className="h-12 bg-white/5 rounded-xl w-full"></div>
                    <div className="h-12 bg-white/5 rounded-xl w-full"></div>
                  </div>
                </div>
              ) : (
                discordData && (
                  <div className="space-y-6">
                    {/* Voice Channels */}
                    {discordData.channels && discordData.channels.length > 0 && (
                      <div>
                        <h3 className="text-gray-500 mb-3 text-xs font-semibold uppercase tracking-wider flex justify-between items-center">
                          Voice Channels
                          <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded-full text-[10px]">{discordData.channels.length}</span>
                        </h3>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                          {discordData.channels.sort((a, b) => a.position - b.position).map(channel => (
                            <div key={channel.id} className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors cursor-default">
                              <Volume2 size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-200 truncate font-medium">{channel.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Members */}
                    {humanMembers.length > 0 && (
                      <div>
                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                          {['online', 'idle', 'dnd'].map(statusGroup => {
                            const groupMembers = humanMembers.filter(m => m.status === statusGroup);
                            if (groupMembers.length === 0) return null;
                            return (
                              <div key={statusGroup} className="space-y-2">
                                <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider pl-1">
                                  {statusGroup === 'dnd' ? 'Do Not Disturb' : statusGroup}
                               </h3>
                               {groupMembers.map(member => (
                                <div key={member.id} className="flex items-center space-x-3 hover:bg-white/5 p-1.5 rounded-xl transition-colors cursor-default">
                                  <div className="relative shrink-0">
                                    <img src={member.avatar_url} alt={member.username} className="w-8 h-8 rounded-full bg-black/40 object-cover" />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#1a1b26] ${
                                      member.status === 'online' ? 'bg-green-500' : 
                                      member.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                  </div>
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-gray-200 truncate leading-tight">
                                      {member.username.length > 7 ? `${member.username.substring(0, 7)}...` : member.username}
                                    </span>
                                  </div>
                                </div>
                               ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Support Card */}
            <div className="bg-mc-pink/10 rounded-3xl p-6 border border-mc-pink/30 shadow-[0_0_40px_rgba(236,72,153,0.1)] relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 text-mc-pink/10 group-hover:text-mc-pink/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Heart size={160} fill="currentColor" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-3 text-mc-pink">
                  <Heart size={20} fill="currentColor" className="animate-pulse" />
                  <span className="text-sm font-bold tracking-wider uppercase">Support Us</span>
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-white">Support</h2>
                <p className="text-gray-300 mb-8 text-sm leading-relaxed">Your help is everything to us and keeps the server running.</p>
                <button className="mt-auto w-full bg-mc-pink text-white font-bold py-3.5 rounded-full hover:bg-pink-600 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] relative z-10 flex justify-center items-center space-x-2 text-sm hover:-translate-y-0.5">
                  <Heart size={16} fill="currentColor" />
                  <span>Support Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            {isLoading ? (
               <div className="bg-white/[0.02] border border-white/5 rounded-3xl min-h-[300px] p-8 animate-pulse flex flex-col justify-end">
                 <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                 <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                 <div className="h-4 bg-white/10 rounded w-5/6 mb-6"></div>
                 <div className="h-10 bg-white/10 rounded-full w-32"></div>
               </div>
            ) : (
              announcements.length > 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl min-h-[300px] flex flex-col justify-end p-8 relative overflow-hidden group cursor-pointer shadow-xl" onClick={() => navigate('/community')}>
                  {announcements[0].banner ? (
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: `url(${announcements[0].banner})` }}></div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-mc-orange/10 to-mc-purple/10 opacity-50"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-mc-orange text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Featured {announcements[0].tag}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {new Date(announcements[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-mc-orange transition-colors">{announcements[0].title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2">{announcements[0].description}</p>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium transition-all backdrop-blur-md border border-white/10">Read More</button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl min-h-[300px] flex items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mc-orange/5 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 shadow-xl rotate-3">
                      <MessageSquare size={28} />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-white mb-2">No Announcements</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">Check back later for updates and events.</p>
                  </div>
                </div>
              )
            )}

            {/* Server Highlights Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-display font-semibold mb-5 flex items-center justify-between pb-3 border-b border-white/10">
                <span>Server Highlights</span>
                <span className="text-xs text-mc-orange font-mono uppercase tracking-wider">Features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 p-4.5 rounded-2xl transition-all duration-300 hover:bg-black/40 hover:border-mc-orange/30 group">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="p-2 bg-mc-orange/10 rounded-xl text-mc-orange group-hover:scale-110 transition-transform">
                      <Coins size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-200 group-hover:text-white text-sm">Dynamic Economy</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Set up individual player shops, trade in the Live Auction House, and work jobs to grow your fortune.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 p-4.5 rounded-2xl transition-all duration-300 hover:bg-black/40 hover:border-mc-purple/30 group">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="p-2 bg-mc-purple/10 rounded-xl text-mc-purple group-hover:scale-110 transition-transform">
                      <Trophy size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-200 group-hover:text-white text-sm">Quests & Rankups</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Tackle over 250+ custom quests. Level up and buy unique survival ranks directly using in-game cash.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 p-4.5 rounded-2xl transition-all duration-300 hover:bg-black/40 hover:border-mc-pink/30 group">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="p-2 bg-mc-pink/10 rounded-xl text-mc-pink group-hover:scale-110 transition-transform">
                      <Sparkles size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-200 group-hover:text-white text-sm">Elite Crates</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Open custom crates at spawn to unlock legendary keys, cosmetic particle trails, and high-tier gear.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/5 p-4.5 rounded-2xl transition-all duration-300 hover:bg-black/40 hover:border-red-500/30 group">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 transition-transform">
                      <Swords size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-200 group-hover:text-white text-sm">Combat Arenas</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Test your skills in the custom PvP Arenas, build dynamic defenses, and conquer our active survival lobbies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Real time users */}
            <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-mc-orange/10 rounded-xl">
                  <Users className="text-mc-orange" size={24} />
                </div>
                <h2 className="text-xl font-display font-semibold">Web Members</h2>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mc-orange/0 via-mc-orange to-mc-orange/0"></div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Registered Users</div>
                {isAppLoading ? (
                  <div className="h-10 bg-white/10 rounded w-16 mx-auto animate-pulse"></div>
                ) : (
                  <div className="text-4xl font-display font-bold text-white flex items-baseline justify-center gap-1">
                    342
                  </div>
                )}
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-display font-semibold mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                <span>Latest News</span>
                <span className="w-2 h-2 rounded-full bg-mc-orange"></span>
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="h-4 bg-white/10 rounded w-16"></div>
                        <div className="h-3 bg-white/10 rounded w-12"></div>
                      </div>
                      <div className="h-4 bg-white/10 rounded w-full mb-1"></div>
                      <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    </div>
                  ))
                ) : latestNews.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">No news published yet.</p>
                ) : (
                  latestNews.map((news) => (
                    <div 
                      key={news.id} 
                      onClick={() => navigate('/community')}
                      className="group cursor-pointer bg-gray-800/30 hover:bg-gray-800 p-4 rounded-2xl transition-all border border-transparent hover:border-mc-purple/50"
                    >
                      <div className="flex items-center space-x-2 mb-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                          ${news.tag === 'Announcement' ? 'bg-mc-orange/20 text-mc-orange border border-mc-orange/30' : ''}
                          ${news.tag === 'Event' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                          ${news.tag === 'Alert' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                        `}>
                          {news.tag}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(news.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-200 group-hover:text-white mb-1 line-clamp-1 text-sm">{news.title}</h4>
                      <div className="flex items-center justify-end text-mc-orange opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => navigate('/community')}
                className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all font-medium text-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                View All News
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Quick Stats bar or Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-mc-orange/10 via-mc-purple/10 to-mc-pink/10 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">99.9%</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Uptime Status</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">20ms</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Lobby Ping</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">340+</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Registered Users</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">24/7</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Active Staff</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
