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

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6 min-h-screen">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
          {/* Left Sidebar - Canvas Settings */}
          <aside className="col-span-12 xl:col-span-3 space-y-4 overflow-auto no-print">
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </aside>

          {/* Main Canvas Area */}
          <main className="col-span-12 xl:col-span-6 min-h-[650px]">
            <div className="panel h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="chip">Workspace</span>
                  <p className="text-sm text-slate-500">
                    Drag, measure, and preview your soft card wall
                  </p>
                </div>
                <div className="hidden md:inline-flex items-center gap-2 text-xs text-slate-500">
                  <span className="badge">Live autosave</span>
                  <span className="badge">Grid & snapping</span>
                </div>
              </div>
              <DesignCanvas canvasRef={canvasRef} />
            </div>
          </main>

          {/* Right Sidebar - Element Panel */}
          <aside className="col-span-12 xl:col-span-3 space-y-4 overflow-auto no-print">
            <ElementPanel />
          </aside>
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
