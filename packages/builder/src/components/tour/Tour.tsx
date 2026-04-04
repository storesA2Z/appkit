import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TOUR_STEPS, type TourStep } from './tour-steps';

interface TourProps {
  open: boolean;
  onClose: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  spotlightRect: DOMRect | null;
}

const STORAGE_KEY = 'appkit-tour-completed';

export function Tour({ open, onClose }: TourProps) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0, spotlightRect: null });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[step];

  const calculatePosition = useCallback((tourStep: TourStep) => {
    const el = document.querySelector(tourStep.target);
    if (!el) {
      setPosition({ top: window.innerHeight / 2 - 60, left: window.innerWidth / 2 - 150, spotlightRect: null });
      return;
    }

    const rect = el.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 140;
    const gap = 12;

    let top = 0;
    let left = 0;

    switch (tourStep.placement) {
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
    }

    // Clamp to viewport
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));

    setPosition({ top, left, spotlightRect: rect });
  }, []);

  useEffect(() => {
    if (open && currentStep) {
      calculatePosition(currentStep);
    }
  }, [open, step, currentStep, calculatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleResize = () => {
      if (currentStep) calculatePosition(currentStep);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, currentStep, calculatePosition]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setStep(0);
    onClose();
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else handleClose();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!open) return null;

  const { spotlightRect } = position;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-spotlight">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 6}
                y={spotlightRect.top - 6}
                width={spotlightRect.width + 12}
                height={spotlightRect.height + 12}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tour-spotlight)"
          style={{ pointerEvents: 'auto' }}
          onClick={handleClose}
        />
      </svg>

      {/* Spotlight ring */}
      {spotlightRect && (
        <div
          className="absolute border-2 border-ide-accent rounded-lg pointer-events-none animate-pulse"
          style={{
            top: spotlightRect.top - 6,
            left: spotlightRect.left - 6,
            width: spotlightRect.width + 12,
            height: spotlightRect.height + 12,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute w-[300px] bg-ide-panel border border-ide-border-bright rounded-xl shadow-dropdown animate-scale-in z-10"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
          <span className="text-[10px] text-ide-accent font-semibold">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
          <button onClick={handleClose} className="p-0.5 hover:bg-ide-hover rounded">
            <X size={12} className="text-ide-text-dim" />
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="text-sm font-semibold text-ide-text-bright mb-1">{currentStep.title}</div>
          <div className="text-[11px] text-ide-text-muted leading-relaxed">{currentStep.description}</div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-ide-border">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? 'bg-ide-accent' : i < step ? 'bg-ide-accent/40' : 'bg-ide-border'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-0.5 px-2 py-1 text-[10px] text-ide-text hover:text-ide-text-bright rounded"
              >
                <ChevronLeft size={10} /> Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-0.5 px-3 py-1 text-[10px] font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
            >
              {step < TOUR_STEPS.length - 1 ? (
                <>Next <ChevronRight size={10} /></>
              ) : (
                'Finish'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useShouldShowTour(): boolean {
  return !localStorage.getItem(STORAGE_KEY);
}
