import React from 'react';
import { useAppkitStore } from '../store/appkit-store';

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-gray-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md font-mono"
        />
      </div>
    </div>
  );
}

export function ThemeMetadataPanel() {
  const theme = useAppkitStore((s) => s.project.theme);
  const metadata = useAppkitStore((s) => s.project.metadata);
  const setThemeColors = useAppkitStore((s) => s.setThemeColors);
  const setThemeTypography = useAppkitStore((s) => s.setThemeTypography);
  const setThemeLayout = useAppkitStore((s) => s.setThemeLayout);
  const setMetadata = useAppkitStore((s) => s.setMetadata);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-3">
        <h3 className="text-sm font-semibold text-gray-900">Theme & App Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6 animate-fade-in">
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">App Metadata</h4>
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">App Name</label>
              <input
                type="text"
                value={metadata.name}
                onChange={(e) => setMetadata({ name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={metadata.description}
                onChange={(e) => setMetadata({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icon URL</label>
                <input
                  type="text"
                  value={metadata.icon || ''}
                  onChange={(e) => setMetadata({ icon: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Splash URL</label>
                <input
                  type="text"
                  value={metadata.splash || ''}
                  onChange={(e) => setMetadata({ splash: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Colors</h4>
          <div className="space-y-2.5">
            <ColorInput label="Primary" value={theme.colors.primary} onChange={(v) => setThemeColors({ primary: v })} />
            <ColorInput label="Secondary" value={theme.colors.secondary} onChange={(v) => setThemeColors({ secondary: v })} />
            <ColorInput label="Accent" value={theme.colors.accent} onChange={(v) => setThemeColors({ accent: v })} />
            <ColorInput label="Background" value={theme.colors.background} onChange={(v) => setThemeColors({ background: v })} />
            <ColorInput label="Text" value={theme.colors.text} onChange={(v) => setThemeColors({ text: v })} />
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Typography</h4>
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
              <select
                value={theme.typography.fontFamily}
                onChange={(e) => setThemeTypography({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
                <input
                  type="text"
                  value={theme.typography.fontSize}
                  onChange={(e) => setThemeTypography({ fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
                <select
                  value={theme.typography.fontWeight}
                  onChange={(e) => setThemeTypography({ fontWeight: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Layout</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
              <input
                type="text"
                value={theme.layout.borderRadius}
                onChange={(e) => setThemeLayout({ borderRadius: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Spacing</label>
              <input
                type="text"
                value={theme.layout.spacing}
                onChange={(e) => setThemeLayout({ spacing: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
