import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEditorStore } from '../store/editor-store';
import { snackBridge } from '../services/snack-bridge';

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewProjectDialog({ open, onClose }: Props) {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('ecommerce-store');
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setCurrentProject = useEditorStore((s) => s.setCurrentProject);

  useEffect(() => {
    if (!open) return;
    fetch('/api/templates')
      .then((r) => r.json())
      .then((data) => {
        setTemplates(data);
        setProjectName('');
        setError(null);
      })
      .catch(() => setError('Failed to load templates'));
  }, [open]);

  if (!open) return null;

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Enter a project name');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName.trim(), template: selectedTemplate }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || 'Failed to create project');
        setCreating(false);
        return;
      }

      // Set project in store
      setCurrentProject(data.project);

      // Load files into Snack preview
      if (data.files) {
        const snackFiles: Record<string, { contents: string; type: 'CODE' }> = {};
        for (const [path, contents] of Object.entries(data.files)) {
          snackFiles[path] = { contents: contents as string, type: 'CODE' };
        }
        snackBridge.updateFiles(snackFiles);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-ide-surface border border-ide-border rounded-xl shadow-2xl w-[640px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ide-border">
          <h2 className="text-sm font-semibold text-ide-text-bright">New Project</h2>
          <button onClick={onClose} className="text-ide-text-dim hover:text-ide-text-bright transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Project name */}
          <div>
            <label className="block text-[11px] font-medium text-ide-text mb-1.5">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My App"
              className="w-full px-3 py-2 text-sm bg-ide-bg border border-ide-border rounded-lg text-ide-text-bright placeholder:text-ide-text-dim focus:outline-none focus:border-ide-accent"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* Template picker */}
          <div>
            <label className="block text-[11px] font-medium text-ide-text mb-1.5">Template</label>
            <div className="grid grid-cols-2 gap-2.5">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate === t.id
                      ? 'border-ide-accent bg-ide-accent/10'
                      : 'border-ide-border bg-ide-bg hover:border-ide-text-dim'
                  }`}
                >
                  <div className="text-[12px] font-semibold text-ide-text-bright">{t.name}</div>
                  <div className="text-[10px] text-ide-text-dim mt-0.5 line-clamp-2">{t.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 bg-ide-surface rounded text-ide-text-dim">
                        {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-ide-border flex items-center justify-between">
          <div className="text-[10px] text-red-400 min-h-[14px]">{error || ''}</div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-[11px] text-ide-text hover:text-ide-text-bright rounded-md hover:bg-ide-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !projectName.trim()}
              className="px-4 py-1.5 text-[11px] font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
