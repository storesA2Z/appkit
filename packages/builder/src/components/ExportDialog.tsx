import React, { useState } from 'react';
import {
  X, Download, FolderDown, Package, FileJson, Code2,
  CheckCircle2, Copy, Smartphone, Terminal, ArrowRight,
} from 'lucide-react';
import JSZip from 'jszip';
import { generateExpoProject } from '@appkit/export';
import { exportAsJson } from '@appkit/export';
import { useAppkitStore } from '../store/appkit-store';

type ExportTab = 'expo' | 'sdk' | 'json';

export function ExportDialog({ onClose }: { onClose: () => void }) {
  const project = useAppkitStore((s) => s.project);
  const [activeTab, setActiveTab] = useState<ExportTab>('expo');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const appName = project.metadata.name || 'my-app';
  const slug = appName.toLowerCase().replace(/\s+/g, '-');

  const handleDownloadExpo = async () => {
    setIsExporting(true);
    try {
      const files = generateExpoProject(project);
      const zip = new JSZip();
      const folder = zip.folder(slug)!;
      for (const file of files) {
        folder.file(file.path, file.content);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJson = () => {
    const json = exportAsJson(project, '1.0.0');
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.appkit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadLayout = () => {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layout.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'expo' as const, label: 'Full Expo Project', icon: Smartphone, desc: 'Ready-to-run app' },
    { id: 'sdk' as const, label: 'Existing RN Project', icon: Package, desc: 'Add to your app' },
    { id: 'json' as const, label: 'Layout JSON', icon: FileJson, desc: 'Data only' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-[680px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <FolderDown size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Export Project</h2>
              <p className="text-xs text-gray-400">Choose how you want to use your layout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-6 pt-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-brand-600' : 'text-gray-400'} />
                <div className="text-left">
                  <div className={`text-xs font-semibold ${isActive ? 'text-brand-700' : 'text-gray-700'}`}>{tab.label}</div>
                  <div className="text-[10px] text-gray-400">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[55vh]">
          {activeTab === 'expo' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Complete Expo Project</p>
                    <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                      Downloads a ZIP with a fully runnable Expo app including all {Object.values(project.pages).reduce((sum, p) => sum + p.sections.length, 0)} sections,
                      4 screens, bottom tab navigation, 12 section components, theme, mock data, and custom component registry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">After downloading:</p>
                {[
                  { step: '1', cmd: `cd ${slug}`, desc: 'Open the project folder' },
                  { step: '2', cmd: 'npm install', desc: 'Install dependencies' },
                  { step: '3', cmd: 'npx expo start', desc: 'Start the dev server' },
                  { step: '4', cmd: 'Press i for iOS or a for Android', desc: 'Run on simulator' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-500 shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{item.cmd}</code>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    {item.step !== '4' && (
                      <button
                        onClick={() => copyToClipboard(item.cmd, item.step)}
                        className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        {copied === item.step ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">What's included:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    '12 section components', '4 page screens',
                    'Bottom tab navigation', 'Theme from your config',
                    'Product card component', 'Section renderer',
                    'Custom component registry', 'Mock data with images',
                    'TypeScript configured', 'Search with filtering',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadExpo}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {isExporting ? 'Generating...' : `Download ${slug}.zip`}
              </button>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Code2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Add to Existing React Native Project</p>
                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                      Download the layout JSON and use it in any React Native or Expo project.
                      Copy the section components from the full export, or build your own renderers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Option A: Use the layout data</p>
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto">
                  <div className="text-gray-500">{'// 1. Download layout.json and add to your project'}</div>
                  <div className="text-emerald-400">{'import'} <span className="text-white">layout</span> {'from'} <span className="text-amber-300">{'"./layout.json"'}</span>;</div>
                  <br />
                  <div className="text-gray-500">{'// 2. Render sections dynamically'}</div>
                  <div className="text-emerald-400">{'const'} <span className="text-white">{'homeSections = layout.pages.home;'}</span></div>
                  <br />
                  <div className="text-gray-500">{'// 3. Map section types to your own components'}</div>
                  <div className="text-emerald-400">{'const'} <span className="text-white">{'sectionMap = {'}</span></div>
                  <div className="text-white pl-4">{'banner: MyBannerComponent,'}</div>
                  <div className="text-white pl-4">{'products: MyProductsComponent,'}</div>
                  <div className="text-white pl-4">{'hero: MyHeroComponent,'}</div>
                  <div className="text-white pl-4">{'custom: (props) => registry[props.componentName],'}</div>
                  <div className="text-white">{'};'}</div>
                </div>

                <button
                  onClick={handleDownloadLayout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors"
                >
                  <Download size={14} />
                  Download layout.json
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Option B: Full export + cherry-pick</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Download the full Expo project, then copy the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">src/sections/</code> folder
                  and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">src/components/</code> folder into your existing project.
                  Each section component is self-contained and only depends on the theme file.
                </p>
                <button
                  onClick={handleDownloadExpo}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-colors"
                >
                  <FolderDown size={14} />
                  {isExporting ? 'Generating...' : 'Download Full Project ZIP'}
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Custom sections:</strong> If you added custom code sections, register your components in{' '}
                  <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">src/sections/custom-registry.ts</code> using
                  the same component names you configured in the builder.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FileJson size={18} className="text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">AppKit Project File</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Exports the full project as <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">.appkit.json</code> —
                      includes layout, theme, metadata, and schema version. You can import this file back into the builder later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 font-mono text-[11px] text-gray-300 max-h-[200px] overflow-y-auto leading-relaxed">
                <pre>{exportAsJson(project, '1.0.0').slice(0, 600)}...</pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadJson}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-xs hover:bg-gray-800 transition-colors"
                >
                  <Download size={14} />
                  Download .appkit.json
                </button>
                <button
                  onClick={() => copyToClipboard(exportAsJson(project, '1.0.0'), 'json')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-colors"
                >
                  {copied === 'json' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied === 'json' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
