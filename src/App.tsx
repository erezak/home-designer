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
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,222,52,0.15),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(124,240,255,0.18),transparent_28%),repeating-linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_6px,transparent_6px,transparent_18px)]" />
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <header className="bg-[#fefae0] text-[#0b0b0b] border-4 border-black rounded-2xl shadow-[14px_14px_0_#0b0b0b] p-4 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-[#0b0b0b] text-[#fefae0] rounded-xl flex items-center justify-center text-2xl font-black shadow-[8px_8px_0_#ffde34]">
                HD
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold">Idea 03 · Neo-Brutalist</p>
                <h1 className="text-2xl md:text-3xl font-black leading-tight">Home Designer — Bold Layout Lab</h1>
                <p className="text-sm md:text-base font-medium text-[#111827]">
                  Chunky controls, loud grids, unapologetic colors. Build elevations with attitude.
                </p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs uppercase font-semibold text-[#0f172a]">Status</p>
              <p className="text-lg font-black leading-tight">Live Canvas</p>
              <p className="text-sm font-medium text-[#111827]">Snap · Measure · Export</p>
            </div>
          </div>
          <Toolbar />
        </header>

        <div className="grid lg:grid-cols-[320px,1fr,320px] gap-4 items-start">
          {/* Left Sidebar - Canvas Settings */}
          <aside className="space-y-4 no-print">
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </aside>

          {/* Main Canvas Area */}
          <main className="bg-[#0f172a] border-4 border-black rounded-3xl shadow-[18px_18px_0_#ffde34] overflow-hidden">
            <DesignCanvas canvasRef={canvasRef} />
          </main>

          {/* Right Sidebar - Element Panel */}
          <aside className="space-y-4 no-print">
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
