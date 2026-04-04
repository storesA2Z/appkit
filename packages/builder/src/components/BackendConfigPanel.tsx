import React from 'react';
import { useAppkitStore } from '../store/appkit-store';
import type { BackendConfig } from '../store/appkit-store';

export function BackendConfigPanel() {
  const config = useAppkitStore((s) => s.backendConfig);
  const setBackendConfig = useAppkitStore((s) => s.setBackendConfig);

  const updateEndpoint = (key: keyof BackendConfig['endpoints'], value: string) => {
    setBackendConfig({ endpoints: { ...config.endpoints, [key]: value } });
  };

  const updateAuth = (changes: Partial<BackendConfig['auth']>) => {
    setBackendConfig({ auth: { ...config.auth, ...changes } });
  };

  const handleExportConfig = () => {
    const exportData = {
      baseUrl: config.baseUrl,
      endpoints: config.endpoints,
      auth: { type: config.auth.type, headerName: config.auth.headerName },
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-ide-border">
        <h3 className="text-sm font-semibold text-ide-text-bright">Backend Connection</h3>
        <p className="text-[10px] text-ide-text-dim mt-0.5">Connect your product API or use demo data</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6 animate-fade-in">
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ide-text-dim mb-3">Mode</h4>
          <div className="flex gap-2">
            {(['demo', 'api'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setBackendConfig({ mode })}
                className={`flex-1 py-2.5 text-xs font-medium rounded-lg border-2 transition-all ${
                  config.mode === mode
                    ? 'border-ide-accent bg-ide-accent-dim text-ide-accent'
                    : 'border-ide-border text-ide-text-muted hover:border-ide-border'
                }`}
              >
                {mode === 'demo' ? '🧪 Demo Mode' : '🔗 API Mode'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-ide-text-dim mt-2">
            {config.mode === 'demo'
              ? 'Uses built-in mock data. No backend required.'
              : 'Connects to your REST API for real product data.'}
          </p>
        </section>

        {config.mode === 'api' && (
          <>
            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ide-text-dim mb-3">Base URL</h4>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => setBackendConfig({ baseUrl: e.target.value })}
                placeholder="https://api.mystore.com"
                className="w-full px-3 py-2 text-sm border border-ide-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-ide-accent"
              />
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ide-text-dim mb-3">Endpoints</h4>
              <div className="space-y-2">
                {(['products', 'categories', 'collections'] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-ide-text mb-1 capitalize">{key}</label>
                    <input
                      type="text"
                      value={config.endpoints[key]}
                      onChange={(e) => updateEndpoint(key, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-ide-border rounded-lg font-mono"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ide-text-dim mb-3">Authentication</h4>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-ide-text mb-1">Auth Type</label>
                  <select
                    value={config.auth.type}
                    onChange={(e) => updateAuth({ type: e.target.value as BackendConfig['auth']['type'] })}
                    className="w-full px-3 py-2 text-sm border border-ide-border rounded-lg"
                  >
                    <option value="none">None</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="apikey">API Key</option>
                  </select>
                </div>
                {config.auth.type !== 'none' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-ide-text mb-1">Header Name</label>
                      <input
                        type="text"
                        value={config.auth.headerName}
                        onChange={(e) => updateAuth({ headerName: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-ide-border rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ide-text mb-1">Token / Key</label>
                      <input
                        type="password"
                        value={config.auth.token}
                        onChange={(e) => updateAuth({ token: e.target.value })}
                        placeholder="Enter your token..."
                        className="w-full px-2 py-1.5 text-xs border border-ide-border rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ide-text-dim mb-3">Compatible APIs</h4>
              <div className="space-y-1.5">
                {['StoresA2Z Cloud', 'Shopify Storefront API', 'WooCommerce REST API', 'Custom REST API'].map((name) => (
                  <div key={name} className="text-xs text-ide-text-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {name}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {config.mode === 'api' && config.baseUrl && (
          <button
            onClick={handleExportConfig}
            className="w-full py-2.5 text-xs font-semibold bg-ide-toolbar text-white rounded-lg hover:bg-ide-hover transition-colors"
          >
            Export api.config.json
          </button>
        )}
      </div>
    </div>
  );
}
