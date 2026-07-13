import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function NewsCollection() {
  const { announcements, deleteAnnouncement, isLoggedIn, user } = useAppContext();

  if (!isLoggedIn || user?.username !== 'fai_kylex') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-gray-400">You must be logged in as fai_kylex to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-display font-bold text-white mb-4">News Collection</h1>
      <p className="text-base text-gray-400 mb-12 max-w-2xl">Manage your published announcements. Deleting an announcement removes it from the public feed permanently.</p>

      <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {announcements.length === 0 ? (
          <div className="p-16 text-center text-gray-500 font-medium">
            No announcements found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex-grow w-full">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider
                      ${ann.tag === 'Announcement' ? 'bg-mc-orange/10 text-mc-orange border border-mc-orange/20' : ''}
                      ${ann.tag === 'Event' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                      ${ann.tag === 'Alert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                    `}>
                      {ann.tag}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      {new Date(ann.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white mb-2">{ann.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 max-w-3xl">{ann.description}</p>
                </div>
                
                <div className="w-full md:w-auto flex justify-end">
                  <button 
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-5 py-2.5 rounded-xl transition-all border border-red-500/20 w-full md:w-auto text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
