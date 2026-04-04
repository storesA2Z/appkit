import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import type { LayoutTemplate, SlotType, WizardSlot } from '@appkit/schema';
import { nanoid } from 'nanoid';

interface CustomSectionWizardProps {
  open: boolean;
  onClose: () => void;
}

const layoutTemplates: { id: LayoutTemplate; label: string; desc: string }[] = [
  { id: 'full-width', label: 'Full Width Card', desc: 'Single column, edge to edge' },
  { id: 'two-column', label: 'Two Column', desc: 'Side by side content' },
  { id: 'horizontal-scroll', label: 'Horizontal Scroll', desc: 'Swipeable row' },
  { id: 'text-image', label: 'Text + Image', desc: 'Content with media' },
];

const slotTypes: { id: SlotType; label: string; icon: string }[] = [
  { id: 'image', label: 'Image', icon: '🖼' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'button', label: 'Button', icon: '🔘' },
  { id: 'divider', label: 'Divider', icon: '➖' },
  { id: 'icon', label: 'Icon', icon: '⭐' },
];

export function CustomSectionWizard({ open, onClose }: CustomSectionWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<LayoutTemplate>('full-width');
  const [slots, setSlots] = useState<WizardSlot[]>([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [padding, setPadding] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);

  const addSection = useAppkitStore((s) => s.addSection);
  const updateSection = useAppkitStore((s) => s.updateSection);

  if (!open) return null;

  const addSlot = (type: SlotType) => {
    setSlots([...slots, { id: nanoid(8), type, label: type, config: {} }]);
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const handleCreate = () => {
    addSection('custom');
    const state = useAppkitStore.getState();
    const sections = state.project.pages[state.currentPage]?.sections ?? [];
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
      updateSection(lastSection.id, {
        customConfig: {
          componentName: name.replace(/\s+/g, ''),
          props: {},
          source: 'wizard',
          wizardLayout: {
            template,
            slots,
            style: { backgroundColor: bgColor, padding, borderRadius },
          },
        },
      });
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setName('');
    setDescription('');
    setTemplate('full-width');
    setSlots([]);
    setBgColor('#ffffff');
    setPadding(16);
    setBorderRadius(8);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={resetAndClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-[500px] bg-ide-panel border border-ide-border-bright rounded-xl shadow-dropdown animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
          <h3 className="text-sm font-semibold text-ide-text-bright">Create Custom Section — Step {step}/3</h3>
          <button onClick={resetAndClose} className="p-1 hover:bg-ide-hover rounded"><X size={14} className="text-ide-text" /></button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 px-4 pt-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-ide-accent' : 'bg-ide-border'}`} />
          ))}
        </div>

        <div className="p-4 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Section Name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Promo Card"
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs text-ide-text-bright outline-none focus:border-ide-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this section display?"
                  rows={3}
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-xs text-ide-text-bright outline-none focus:border-ide-accent resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-2">Layout Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {layoutTemplates.map((lt) => (
                    <button
                      key={lt.id}
                      onClick={() => setTemplate(lt.id)}
                      className={`px-3 py-2 rounded-md text-left text-xs transition-colors ${
                        template === lt.id
                          ? 'bg-ide-accent-dim border border-ide-accent text-ide-text-bright'
                          : 'bg-ide-bg border border-ide-border text-ide-text-muted hover:border-ide-border-bright'
                      }`}
                    >
                      <div className="font-medium">{lt.label}</div>
                      <div className="text-[9px] text-ide-text-dim mt-0.5">{lt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-2">Content Slots</label>
                <div className="flex gap-1 mb-2">
                  {slotTypes.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => addSlot(st.id)}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] bg-ide-bg border border-ide-border rounded hover:border-ide-accent-border text-ide-text-muted hover:text-ide-accent transition-colors"
                    >{st.icon} {st.label}</button>
                  ))}
                </div>
                <div className="space-y-1">
                  {slots.map((slot, i) => (
                    <div key={slot.id} className="flex items-center gap-2 px-2 py-1.5 bg-ide-bg border border-ide-border rounded text-xs text-ide-text-muted">
                      <span className="text-[10px]">{slotTypes.find((s) => s.id === slot.type)?.icon}</span>
                      <span className="flex-1">{slot.type}</span>
                      <button onClick={() => removeSlot(slot.id)} className="text-ide-text-dim hover:text-red-400 text-[10px]">×</button>
                    </div>
                  ))}
                  {slots.length === 0 && (
                    <div className="text-center py-4 text-[10px] text-ide-text-dim">Add content slots above</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Background</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Padding</label>
                  <input type="number" value={padding} onChange={(e) => setPadding(+e.target.value)} className="w-full px-2 py-1 bg-ide-bg border border-ide-border rounded text-xs text-ide-text-bright outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-ide-text-dim uppercase tracking-wider mb-1">Radius</label>
                  <input type="number" value={borderRadius} onChange={(e) => setBorderRadius(+e.target.value)} className="w-full px-2 py-1 bg-ide-bg border border-ide-border rounded text-xs text-ide-text-bright outline-none" />
                </div>
              </div>

              <div className="p-4 rounded-lg border border-ide-border" style={{ backgroundColor: bgColor, padding, borderRadius }}>
                <div className="text-center text-xs text-gray-500">
                  Preview: {name || 'Custom Section'}
                  <div className="text-[10px] mt-1">{slots.length} slots · {template}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between px-4 py-3 border-t border-ide-border">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : resetAndClose()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-ide-text hover:text-ide-text-bright rounded"
          >
            <ChevronLeft size={12} /> {step > 1 ? 'Back' : 'Cancel'}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !name.trim()}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Next <ChevronRight size={12} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-4 py-1.5 text-xs font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
            >Create Section</button>
          )}
        </div>
      </div>
    </div>
  );
}
