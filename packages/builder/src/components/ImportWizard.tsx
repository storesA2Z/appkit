import React, { useState, useCallback } from 'react';
import { X, Upload, ChevronRight, ChevronLeft, Check, AlertCircle, FileCode } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { analyzeProject, matchComponents, extractTheme } from '../importer';
import type { ProjectAnalysis, SectionMatch } from '../importer';
import type { ThemeConfig } from '@appkit/schema';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'analysis' | 'mapping' | 'confirm';

export function ImportWizard({ open, onClose }: ImportWizardProps) {
  const [step, setStep] = useState<Step>('upload');
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [matches, setMatches] = useState<SectionMatch[]>([]);
  const [extractedTheme, setExtractedTheme] = useState<ThemeConfig | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);

  const addSection = useAppkitStore((s) => s.addSection);
  const setProject = useAppkitStore((s) => s.setProject);
  const project = useAppkitStore((s) => s.project);

  const resetAndClose = () => {
    setStep('upload');
    setAnalysis(null);
    setMatches([]);
    setExtractedTheme(null);
    setSelectedMatches(new Set());
    setImporting(false);
    onClose();
  };

  if (!open) return null;

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const entries: { path: string; content: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = (file as any).webkitRelativePath || file.name;
      if (/\.(tsx?|jsx?|json)$/.test(path) && !path.includes('node_modules')) {
        const content = await file.text();
        entries.push({ path, content });
      }
    }

    const result = analyzeProject(entries);
    setAnalysis(result);

    const sectionMatches = matchComponents(result.components);
    setMatches(sectionMatches);
    setSelectedMatches(new Set(sectionMatches.map((_, i) => i)));

    const theme = extractTheme(result.components);
    setExtractedTheme(theme);

    setStep('analysis');
  }, []);

  const toggleMatch = (index: number) => {
    setSelectedMatches((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleImport = () => {
    setImporting(true);

    // Add matched sections
    for (let i = 0; i < matches.length; i++) {
      if (selectedMatches.has(i)) {
        addSection(matches[i].sectionType);
      }
    }

    // Apply extracted theme if available
    if (extractedTheme) {
      setProject({ ...project, theme: extractedTheme });
    }

    setTimeout(() => {
      resetAndClose();
    }, 500);
  };

  const stepIndex = { upload: 0, analysis: 1, mapping: 2, confirm: 3 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={resetAndClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-[560px] max-h-[80vh] bg-ide-panel border border-ide-border-bright rounded-xl shadow-dropdown animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border shrink-0">
          <h3 className="text-sm font-semibold text-ide-text-bright">Import RN/Expo Project</h3>
          <button onClick={resetAndClose} className="p-1 hover:bg-ide-hover rounded">
            <X size={14} className="text-ide-text" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 px-4 pt-3 shrink-0">
          {['Upload', 'Analysis', 'Mapping', 'Confirm'].map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <div className={`h-1 rounded-full mb-1 ${i <= stepIndex[step] ? 'bg-ide-accent' : 'bg-ide-border'}`} />
              <span className={`text-[9px] ${i <= stepIndex[step] ? 'text-ide-accent' : 'text-ide-text-dim'}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-16 h-16 rounded-2xl bg-ide-bg border-2 border-dashed border-ide-accent-border flex items-center justify-center">
                <Upload size={24} className="text-ide-accent" />
              </div>
              <div className="text-center">
                <div className="text-sm text-ide-text-bright font-medium">Upload Project Folder</div>
                <div className="text-[11px] text-ide-text-dim mt-1">Select a React Native or Expo project folder</div>
              </div>
              <label className="px-4 py-2 bg-ide-accent text-white text-xs font-semibold rounded-md cursor-pointer hover:opacity-90 transition-opacity">
                Choose Folder
                <input
                  type="file"
                  className="hidden"
                  {...({ webkitdirectory: 'true', directory: 'true' } as any)}
                  onChange={handleFileUpload}
                />
              </label>
              <div className="text-[10px] text-ide-text-dim">Supports .tsx, .jsx, .ts, .js, .json files</div>
            </div>
          )}

          {step === 'analysis' && analysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Components Found" value={analysis.components.length} />
                <Stat label="Screens Detected" value={analysis.screens.length} />
                <Stat label="Dependencies" value={Object.keys(analysis.dependencies).length} />
                <Stat label="Section Matches" value={matches.length} />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-ide-text-dim uppercase tracking-wider">Navigation</div>
                <div className="flex gap-2">
                  {analysis.hasExpoRouter && <Badge label="Expo Router" />}
                  {analysis.hasReactNavigation && <Badge label="React Navigation" />}
                  {!analysis.hasExpoRouter && !analysis.hasReactNavigation && <Badge label="No router detected" dim />}
                </div>
              </div>

              {analysis.screens.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-ide-text-dim uppercase tracking-wider">Screens</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.screens.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-ide-bg border border-ide-border rounded text-[10px] text-ide-text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-3">
              <div className="text-[10px] text-ide-text-dim uppercase tracking-wider">
                Component → Section Mapping ({selectedMatches.size}/{matches.length} selected)
              </div>
              {matches.length === 0 ? (
                <div className="text-center py-8 text-xs text-ide-text-dim">
                  <AlertCircle size={20} className="mx-auto mb-2 text-ide-text-dim" />
                  No components matched AppKit sections.
                  <br />You can still import the extracted theme.
                </div>
              ) : (
                <div className="space-y-1">
                  {matches.map((match, i) => (
                    <button
                      key={i}
                      onClick={() => toggleMatch(i)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-xs transition-colors ${
                        selectedMatches.has(i)
                          ? 'bg-ide-accent-dim border border-ide-accent text-ide-text-bright'
                          : 'bg-ide-bg border border-ide-border text-ide-text-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        selectedMatches.has(i) ? 'bg-ide-accent border-ide-accent' : 'border-ide-border'
                      }`}>
                        {selectedMatches.has(i) && <Check size={10} className="text-white" />}
                      </div>
                      <FileCode size={12} className="shrink-0 text-ide-text-dim" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{match.component.name}</div>
                        <div className="text-[9px] text-ide-text-dim truncate">{match.component.filePath}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-ide-accent font-mono">{match.sectionType}</div>
                        <div className="text-[9px] text-ide-text-dim">{Math.round(match.confidence * 100)}% match</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-xs text-ide-text-bright font-medium">Import Summary</div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs">
                  <span className="text-ide-text-muted">Sections to add</span>
                  <span className="text-ide-text-bright font-mono">{selectedMatches.size}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs">
                  <span className="text-ide-text-muted">Apply extracted theme</span>
                  <span className="text-ide-text-bright">{extractedTheme ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {extractedTheme && (
                <div className="space-y-1">
                  <div className="text-[10px] text-ide-text-dim uppercase tracking-wider">Extracted Colors</div>
                  <div className="flex gap-2">
                    {Object.entries(extractedTheme.colors).map(([name, color]) => (
                      <div key={name} className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded border border-ide-border" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-ide-text-dim">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between px-4 py-3 border-t border-ide-border shrink-0">
          <button
            onClick={() => {
              if (step === 'upload') resetAndClose();
              else if (step === 'analysis') setStep('upload');
              else if (step === 'mapping') setStep('analysis');
              else setStep('mapping');
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-ide-text hover:text-ide-text-bright rounded"
          >
            <ChevronLeft size={12} /> {step === 'upload' ? 'Cancel' : 'Back'}
          </button>

          {step !== 'upload' && step !== 'confirm' && (
            <button
              onClick={() => {
                if (step === 'analysis') setStep('mapping');
                else if (step === 'mapping') setStep('confirm');
              }}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Next <ChevronRight size={12} />
            </button>
          )}

          {step === 'confirm' && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-1.5 text-xs font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {importing ? 'Importing...' : 'Import Project'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-3 py-2 bg-ide-bg border border-ide-border rounded-md">
      <div className="text-lg font-bold text-ide-text-bright">{value}</div>
      <div className="text-[10px] text-ide-text-dim">{label}</div>
    </div>
  );
}

function Badge({ label, dim }: { label: string; dim?: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] border ${
      dim ? 'bg-ide-bg border-ide-border text-ide-text-dim' : 'bg-ide-accent-dim border-ide-accent text-ide-accent'
    }`}>
      {label}
    </span>
  );
}
