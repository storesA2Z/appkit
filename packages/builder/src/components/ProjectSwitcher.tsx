import React, { useState } from 'react';
import { Plus, Copy, Trash2, FolderOpen, Store } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';

const storeTypes = [
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'grocery', label: 'Grocery', emoji: '🛒' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'custom', label: 'Custom', emoji: '🎨' },
];

export function ProjectSwitcher() {
  const projects = useAppkitStore((s) => s.projects);
  const createProject = useAppkitStore((s) => s.createProject);
  const openProject = useAppkitStore((s) => s.openProject);
  const duplicateProject = useAppkitStore((s) => s.duplicateProject);
  const deleteProject = useAppkitStore((s) => s.deleteProject);
  const currentProjectId = useAppkitStore((s) => s.currentProjectId);

  const [showCreate, setShowCreate] = useState(projects.length === 0);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('fashion');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProject(newName.trim(), newType);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-ide-panel rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ide-text-bright">Your Projects</h2>
              <p className="text-xs text-ide-text-muted">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-ide-accent text-white text-sm font-semibold rounded-lg hover:bg-ide-accent transition-colors"
          >
            <Plus size={15} />
            New Project
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {showCreate && (
            <div className="mb-6 p-5 border-2 border-dashed border-ide-accent-border rounded-xl bg-ide-accent-dim animate-slide-up">
              <h3 className="text-sm font-semibold text-ide-text-bright mb-3">Create New Project</h3>
              <input
                type="text"
                placeholder="Project name (e.g., My Fashion Store)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
                className="w-full px-3 py-2.5 text-sm border border-ide-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-ide-accent"
              />
              <div className="flex gap-2 mb-4 flex-wrap">
                {storeTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setNewType(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      newType === t.id
                        ? 'border-ide-accent bg-ide-accent-dim text-ide-accent'
                        : 'border-ide-border text-ide-text hover:border-ide-border'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="px-4 py-2 bg-ide-accent text-white text-sm font-semibold rounded-lg hover:bg-ide-accent disabled:opacity-40 transition-colors"
                >
                  Create
                </button>
                {projects.length > 0 && (
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 text-sm text-ide-text hover:text-ide-text-bright transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {projects.length === 0 && !showCreate && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-ide-hover flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={28} className="text-ide-text-dim" />
              </div>
              <p className="text-sm font-medium text-ide-text-muted">No projects yet</p>
              <p className="text-xs text-ide-text-dim mt-1">Create your first mobile store layout</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {projects.map((p) => {
              const isActive = currentProjectId === p.id;
              const typeInfo = storeTypes.find((t) => t.id === p.storeType);
              const edited = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '';

              return (
                <div
                  key={p.id}
                  className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-ide-accent bg-ide-accent-dim shadow-dropdown'
                      : 'border-surface-3 hover:border-ide-border hover:shadow-panel'
                  }`}
                  onClick={() => openProject(p.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeInfo?.emoji || '🏪'}</span>
                      <div>
                        <div className="text-sm font-semibold text-ide-text-bright truncate max-w-[160px]">{p.name}</div>
                        <div className="text-[10px] text-ide-text-dim">{typeInfo?.label || 'Custom'} store</div>
                      </div>
                    </div>
                  </div>

                  {edited && <div className="text-[10px] text-ide-text-dim mt-1">Edited {edited}</div>}

                  {isActive && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-ide-accent text-white text-[9px] font-semibold rounded">
                      ACTIVE
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => duplicateProject(p.id)}
                      className="p-1.5 rounded-md hover:bg-ide-hover text-ide-text-dim hover:text-ide-text"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteProject(p.id); }}
                      className="p-1.5 rounded-md hover:bg-red-50 text-ide-text-dim hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
