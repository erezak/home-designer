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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.18),transparent_26%),linear-gradient(135deg,#0f172a,#0b1221)]" />
      <div className="floating-dots" />

      <div className="relative z-10 flex flex-col h-screen max-w-[1600px] mx-auto px-6 py-6 gap-4">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="grid flex-1 min-h-0 grid-cols-[280px,1fr,340px] gap-4">
          {/* Left Sidebar - Canvas Settings */}
          <aside className="panel no-print overflow-hidden shadow-2xl">
            <div className="h-full overflow-y-auto pr-1 space-y-4">
              <CanvasSettings />
              <AreaSummary />
              <ExportPanel canvasRef={canvasRef} />
            </div>
          </aside>

          {/* Main Canvas Area */}
          <main className="glass relative overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(125,211,252,0.1),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(236,72,153,0.08),transparent_32%)]" />
            <div className="relative h-full">
              <DesignCanvas canvasRef={canvasRef} />
            </div>
          </main>

          {/* Right Sidebar - Element Panel */}
          <aside className="panel no-print overflow-hidden shadow-2xl">
            <div className="h-full overflow-y-auto pr-1">
              <ElementPanel />
            </div>
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
