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
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
          {/* Top Toolbar */}
          <Toolbar />

          {/* Main Content */}
          <div className="flex flex-col xl:flex-row gap-6 overflow-hidden p-6">
            {/* Left Sidebar - Canvas Settings */}
            <aside className="w-full xl:w-72 space-y-4 no-print">
              <CanvasSettings />
              <AreaSummary />
              <ExportPanel canvasRef={canvasRef} />
            </aside>

            {/* Main Canvas Area */}
            <main className="flex-1 overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 shadow-inner">
              <DesignCanvas canvasRef={canvasRef} />
            </main>

            {/* Right Sidebar - Element Panel */}
            <aside className="w-full xl:w-80 space-y-4 no-print">
              <ElementPanel />
            </aside>
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
