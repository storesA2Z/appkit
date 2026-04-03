import React, { useState } from 'react';
import type { CustomConfig } from '@appkit/schema';

interface Props {
  config: CustomConfig;
  onChange: (changes: Partial<CustomConfig>) => void;
}

export function CustomProperties({ config, onChange }: Props) {
  const cc = config.customConfig || { componentName: '', props: {} };
  const [propsText, setPropsText] = useState(JSON.stringify(cc.props || {}, null, 2));
  const [propsError, setPropsError] = useState('');

  const updateCustomConfig = (changes: Partial<typeof cc>) => {
    onChange({ customConfig: { ...cc, ...changes } } as any);
  };

  const handlePropsChange = (text: string) => {
    setPropsText(text);
    try {
      const parsed = JSON.parse(text);
      setPropsError('');
      updateCustomConfig({ props: parsed });
    } catch {
      setPropsError('Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 font-medium mb-1">Custom Component</p>
        <p className="text-[11px] text-blue-600 leading-relaxed">
          Register your own React Native component in the Expo template's section registry,
          then reference it by name here. Props are passed as-is to your component.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Component Name</label>
        <input
          type="text"
          value={cc.componentName || ''}
          onChange={(e) => updateCustomConfig({ componentName: e.target.value })}
          placeholder="e.g. MyBrandStory"
          className="w-full px-2 py-1.5 text-sm border rounded-md font-mono"
        />
        <p className="text-[10px] text-gray-400 mt-1">Must match the name registered in your section registry</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Component Path (optional)</label>
        <input
          type="text"
          value={cc.componentPath || ''}
          onChange={(e) => updateCustomConfig({ componentPath: e.target.value })}
          placeholder="e.g. ./src/sections/MyBrandStory"
          className="w-full px-2 py-1.5 text-sm border rounded-md font-mono"
        />
        <p className="text-[10px] text-gray-400 mt-1">Helps document where your component lives</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Props (JSON)</label>
        <textarea
          value={propsText}
          onChange={(e) => handlePropsChange(e.target.value)}
          rows={6}
          spellCheck={false}
          className={`w-full px-2 py-1.5 text-sm border rounded-md font-mono resize-y ${
            propsError ? 'border-red-300 bg-red-50' : ''
          }`}
        />
        {propsError && <p className="text-[10px] text-red-500 mt-0.5">{propsError}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Fallback Text</label>
        <input
          type="text"
          value={cc.fallbackText || ''}
          onChange={(e) => updateCustomConfig({ fallbackText: e.target.value })}
          placeholder="Shown in builder preview"
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
    </div>
  );
}
