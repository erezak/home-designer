import { useRef } from 'react';
import { useDesign } from './context/DesignContext';
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
  const { state } = useDesign();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex">
      {/* Persistent Navigation */}
      <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800 no-print">
        <div className="px-4 py-5 border-b border-slate-800">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Home Designer</p>
          <h1 className="text-lg font-semibold">Dashboard Dense</h1>
          <p className="text-xs text-slate-500 mt-1">Speed-first layout</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-xs uppercase text-slate-500 mb-2">Navigation</p>
            <div className="space-y-1">
              <button className="nav-item active">Overview</button>
              <button className="nav-item">Canvas</button>
              <button className="nav-item">Elements</button>
              <button className="nav-item">Exports</button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500 mb-2">Views</p>
            <Toolbar dense />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2">
            <p className="text-xs text-slate-400">Project Stats</p>
            <AreaSummary variant="inline" />
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1">Autosave enabled</p>
          <p className="text-sm text-slate-100 font-medium">Local backup active</p>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Command bar */}
        <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3">
          <Toolbar />
        </div>

          {/* Content grid */}
        <div className="flex-1 overflow-hidden px-4 py-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Controls column */}
            <div className="col-span-3 flex flex-col gap-3 overflow-y-auto pr-1 no-print">
              <CanvasSettings />
              <ExportPanel canvasRef={canvasRef} />
            </div>

            {/* Canvas column */}
            <div className="col-span-6 flex flex-col gap-3 overflow-hidden">
              <div className="panel soft">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Workspace</p>
                    <h2 className="text-base font-semibold text-slate-800">Canvas & Layout</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="badge">Grid {state.canvas.showGrid ? 'on' : 'off'}</span>
                    <span className="badge">Scale 1:{state.canvas.scale}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                  <DesignCanvas canvasRef={canvasRef} />
                </div>
              </div>
            </div>

            {/* Elements column */}
            <div className="col-span-3 flex flex-col gap-3 overflow-y-auto pl-1 no-print">
              <ElementPanel />
            </div>
          </div>
        </div>
      </div>
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
