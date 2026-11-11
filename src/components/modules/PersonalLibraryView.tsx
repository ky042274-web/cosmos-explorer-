import React, { useState } from 'react';
import { SavedLibraryItem, Language } from '../../types/cosmos';
import {
  Bookmark,
  Trash2,
  Download,
  Upload,
  Plus,
  BookOpen,
  Sparkles,
  Wifi,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

interface PersonalLibraryViewProps {
  savedItems: SavedLibraryItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: (item: SavedLibraryItem) => void;
  isOnline: boolean;
  language: Language;
}

export const PersonalLibraryView: React.FC<PersonalLibraryViewProps> = ({
  savedItems,
  onRemoveItem,
  onAddItem,
  isOnline,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'new-note' | 'offline-status'>('bookmarks');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    const newItem: SavedLibraryItem = {
      id: `note-${Date.now()}`,
      type: 'research-note',
      title: noteTitle.trim(),
      savedAt: new Date().toLocaleString(),
      data: { content: noteContent.trim() },
    };
    onAddItem(newItem);
    setNoteTitle('');
    setNoteContent('');
    setActiveTab('bookmarks');
  };

  const exportLibraryJson = () => {
    const dataStr = JSON.stringify(savedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cosmos_Personal_Library_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importLibraryJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => onAddItem(item));
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            <span>Personal Space Library & Offline Cache Manager</span>
          </h1>
          <p className="text-xs text-slate-400">
            Locally stored celestial bookmarks, personal research notes, and persistent educational offline encyclopedia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLibraryJson}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (JSON)</span>
          </button>
          <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={importLibraryJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs w-fit">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            activeTab === 'bookmarks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Saved Items ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('new-note')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            activeTab === 'new-note' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Add Observation Note
        </button>
        <button
          onClick={() => setActiveTab('offline-status')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            activeTab === 'offline-status' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Offline Explorer Status
        </button>
      </div>

      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center text-slate-500">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <div className="text-sm font-semibold text-slate-400">Your Library is Empty</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the Solar System, AI Assistant, or Space Missions and click &quot;Bookmark&quot; to build your personal space research collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.type.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px]">{item.savedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    {item.data?.content && (
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {item.data.content}
                      </p>
                    )}
                    {item.data?.overview && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.data.overview}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Remove from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'new-note' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create Research Observation Note</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Observation Title</label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Telescopic observation of Jupiter's Red Spot transit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Observation Details</label>
            <textarea
              rows={5}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record atmospheric conditions, focal length, celestial coordinates, or theoretical hypotheses..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={!noteTitle.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              Save Note to Personal Library
            </button>
          </div>
        </div>
      )}

      {activeTab === 'offline-status' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <span>PWA Offline Space Explorer Caching Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                All celestial planetary parameters, astronomical calculators, 3D procedural textures, and courses are pre-cached locally.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>OFFLINE READY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Local Cache Footprint</div>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-1">~14.2 MB</div>
              <div className="text-[10px] text-slate-500">Stored in browser IndexedDB/LocalStorage</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Network State</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {isOnline ? 'Online (DSN Connected)' : 'Offline (Local Mirror Active)'}
              </div>
              <div className="text-[10px] text-slate-500">Automatic transparent fallbacks</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Offline Modules</div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-1">24 / 24 Available</div>
              <div className="text-[10px] text-slate-500">With cached reference telemetry</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
