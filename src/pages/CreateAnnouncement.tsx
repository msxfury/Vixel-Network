import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Info, Check } from 'lucide-react';
import { useAppContext, TagType } from '../AppContext';

export default function CreateAnnouncement() {
  const { addAnnouncement, isLoggedIn, user } = useAppContext();
  const navigate = useNavigate();

  if (!isLoggedIn || user?.username !== 'fai_kylex') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-gray-400">You must be logged in as fai_kylex to create announcements.</p>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<string[]>(['']);
  const [tag, setTag] = useState<TagType>('Announcement');
  const [banner, setBanner] = useState('');


  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addAnnouncement({
      title,
      description,
      links: links.filter(l => l.trim() !== '').join(', '),
      tag,
      banner: banner || null,
    });

    navigate('/community');
  };

  const addLink = () => setLinks([...links, '']);
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Create Announcement!</h1>

      <form onSubmit={handlePublish} className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/10 space-y-8 backdrop-blur-md">
        
        {/* Banner Upload Mock */}
        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">Upload Banner URL (Optional)</label>
          <div className="flex items-center space-x-3">
            <div className="flex-grow">
              <input 
                type="text" 
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://example.com/banner.png"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-mc-orange transition-colors"
              />
            </div>
            <button type="button" className="bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-colors">
              <Upload size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">Title</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Awesome Title Here"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xl text-white font-display font-semibold focus:outline-none focus:border-mc-orange transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-gray-400 text-sm font-semibold">Description</label>
            <div className="flex items-center space-x-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <Info size={14} />
              <span>Markdown supported: **bold**, *cursive*, # Title</span>
            </div>
          </div>
          <textarea 
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your announcement here..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-base text-gray-200 h-64 focus:outline-none focus:border-mc-orange resize-none transition-colors"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">Links</label>
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input 
                  type="text" 
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="discord.gg/GDTsV7ttJZ"
                  className="flex-grow bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-mc-orange transition-colors"
                />
                {links.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeLink(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addLink}
              className="text-mc-orange text-sm font-semibold hover:text-mc-orange-dark transition-colors"
            >
              + Add Link
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-4">Tag</label>
          <div className="flex flex-wrap gap-3">
            <button 
              type="button"
              onClick={() => setTag('Announcement')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${tag === 'Announcement' ? 'border-mc-orange bg-mc-orange/10 text-mc-orange' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
            >
              {tag === 'Announcement' && <Check size={16} />}
              <span>Announcement</span>
            </button>
            <button 
              type="button"
              onClick={() => setTag('Event')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${tag === 'Event' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
            >
              {tag === 'Event' && <Check size={16} />}
              <span>Event</span>
            </button>
            <button 
              type="button"
              onClick={() => setTag('Alert')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${tag === 'Alert' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
            >
              {tag === 'Alert' && <Check size={16} />}
              <span>Alert</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-right">
          <button 
            type="submit"
            className="bg-mc-orange hover:bg-mc-orange-dark text-white font-semibold text-lg px-10 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            Publish
          </button>
        </div>

      </form>
    </div>
  );
}
