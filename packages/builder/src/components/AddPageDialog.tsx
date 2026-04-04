import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import type { NavType } from '@appkit/schema';

interface AddPageDialogProps {
  open: boolean;
  onClose: () => void;
}

const navTypes: { id: NavType; label: string; desc: string }[] = [
  { id: 'stack', label: 'Stack Screen', desc: 'Navigate via link/button' },
  { id: 'tab', label: 'Bottom Tab', desc: 'Adds to tab bar (max 5)' },
  { id: 'drawer', label: 'Drawer Menu', desc: 'Side menu item' },
];

const icons = ['📄', '📝', '🛒', '💬', '📊', '⚙️', '🎨', '📦', '🔔', '❤️', '📖', '🏷️', '🎯', '🌟', '📸', '🗂️'];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function AddPageDialog({ open, onClose }: AddPageDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('📄');
  const [navType, setNavType] = useState<NavType>('stack');
  const [slugEdited, setSlugEdited] = useState(false);

  const addPage = useAppkitStore((s) => s.addPage);

  if (!open) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) return;
    addPage(name.trim(), slug.trim(), navType, icon);
    setName('');
    setSlug('');
    setIcon('📄');
    setNavType('stack');
    setSlugEdited(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-[400px] bg-ide-panel border border-ide-border-bright rounded-xl shadow-dropdown animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
          <h3 className="text-sm font-semibold text-ide-text-bright">Add Page</h3>
          <button onClick={onClose} className="p-1 hover:bg-ide-hover rounded"><X size={14} className="text-ide-text" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Page Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="About Us"
              className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs text-ide-text-bright outline-none focus:border-ide-accent"
            />
          </div>

          <div>
            <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="about-us"
              className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs text-ide-text-bright font-mono outline-none focus:border-ide-accent"
            />
          </div>

          <div>
            <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Icon</label>
            <div className="flex flex-wrap gap-1">
              {icons.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-colors ${
                    icon === i ? 'bg-ide-accent-dim border border-ide-accent' : 'bg-ide-bg hover:bg-ide-hover border border-ide-border'
                  }`}
                >{i}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Navigation Type</label>
            <div className="space-y-1">
              {navTypes.map((nt) => (
                <button
                  key={nt.id}
                  onClick={() => setNavType(nt.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-xs transition-colors ${
                    navType === nt.id
                      ? 'bg-ide-accent-dim border border-ide-accent text-ide-text-bright'
                      : 'bg-ide-bg border border-ide-border text-ide-text-muted hover:border-ide-border-bright'
                  }`}
                >
                  <span className="font-medium">{nt.label}</span>
                  <span className="text-[10px] text-ide-text-dim">{nt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-ide-border">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-ide-text hover:text-ide-text-bright rounded">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || !slug.trim()}
            className="px-4 py-1.5 text-xs font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 disabled:opacity-40 transition-opacity"
          >Create Page</button>
        </div>
      </div>
    </div>
  );
}
