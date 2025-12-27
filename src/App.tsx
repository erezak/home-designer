import { useRef } from 'react';
import { DesignProvider } from './context/DesignContext';
import {
  DesignCanvas,
  CanvasSettings,
  ElementPanel,
  Toolbar,
  ExportPanel,
  AreaSummary,
} from './components';

function AppContent() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigation = [
    { label: 'Workspace', href: '#workspace' },
    { label: 'Canvas', href: '#canvas-settings' },
    { label: 'Elements', href: '#elements-panel' },
    { label: 'Export', href: '#export-panel' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/50 to-slate-50 text-slate-900">
      {/* App Bar */}
      <header className="sticky top-0 z-30 border-b border-indigo-100/80 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-200/70 flex items-center justify-center text-white font-semibold">
              HD
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-indigo-500 font-semibold">
                Material Studio
              </p>
              <h1 className="text-xl font-semibold text-slate-900 leading-tight">
                Home Designer
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              Autosave enabled
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 shadow-sm">
              Material-inspired layout
            </span>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Toolbar />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex gap-5 min-h-[calc(100vh-160px)]">
        {/* Navigation Rail */}
        <nav className="hidden lg:block w-48 shrink-0 space-y-2">
          <div className="panel p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                Navigation
              </p>
              <p className="text-sm text-slate-500">Jump between primary areas</p>
            </div>
            <ul className="py-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden className="text-slate-400">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Left Sidebar - Canvas Settings */}
        <aside
          id="canvas-settings"
          className="w-[320px] shrink-0 space-y-4 sticky top-28 self-start no-print"
        >
          <CanvasSettings />
          <AreaSummary />
          <div id="export-panel">
            <ExportPanel canvasRef={canvasRef} />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <section id="workspace" className="flex-1 min-w-0 space-y-4">
          <div className="panel p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100/80 bg-slate-50/60">
              <p className="text-xs uppercase tracking-[0.22em] text-indigo-500 font-semibold mb-1">
                Layout
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Canvas workspace</h2>
                  <p className="text-sm text-slate-500">
                    Structured surfaces with predictable elevation and spacing
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    Primary · Indigo
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    Secondary · Sky
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-100/60">
              <DesignCanvas canvasRef={canvasRef} />
            </div>
          </div>
        </section>

        {/* Right Sidebar - Element Panel */}
        <aside
          id="elements-panel"
          className="w-[340px] shrink-0 space-y-4 sticky top-28 self-start no-print"
        >
          <ElementPanel />
        </aside>
      </main>
    </div>
  );
}

function App() {
  return (
    <DesignProvider>
      <AppContent />
    </DesignProvider>
  );
}

export default App;
