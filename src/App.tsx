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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Accessible high-clarity</p>
            <h1 className="text-3xl font-semibold text-white">Home Designer</h1>
            <p className="text-sm text-slate-200 max-w-3xl">
              Clear groupings, predictable navigation, and bold contrast guide every step. Large targets, focus rings,
              and readable typography keep the workspace confident and keyboard friendly.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <Toolbar />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-6 xl:grid-cols-[340px_1fr_360px]">
          {/* Left rail */}
          <div className="space-y-4">
            <div className="panel space-y-3">
              <div className="flex items-center gap-2">
                <span className="badge bg-indigo-50 border-indigo-200 text-indigo-800">Guided flow</span>
                <span className="text-xs text-slate-500">Stay oriented at every step</span>
              </div>
              <ol className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="badge bg-slate-100 text-slate-800 border-slate-200 w-8 justify-center">1</span>
                  <div>
                    <p className="font-semibold text-slate-800">Frame the canvas</p>
                    <p className="section-hint">Set name, size, material, and scale for accurate context.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="badge bg-slate-100 text-slate-800 border-slate-200 w-8 justify-center">2</span>
                  <div>
                    <p className="font-semibold text-slate-800">Place and refine elements</p>
                    <p className="section-hint">Add niches or shelves, adjust dimensions, and switch positioning modes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="badge bg-slate-100 text-slate-800 border-slate-200 w-8 justify-center">3</span>
                  <div>
                    <p className="font-semibold text-slate-800">Measure, review, export</p>
                    <p className="section-hint">Use distance markers, summaries, and exports with clear labels.</p>
                  </div>
                </li>
              </ol>
            </div>
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </div>

          {/* Center canvas area */}
          <section className="space-y-4">
            <div className="surface-card p-5 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace overview</p>
                  <h2 className="text-xl font-semibold text-slate-800">Plan with clarity and confidence</h2>
                  <p className="text-sm text-slate-600">
                    Grids, contrast, and anchored labels keep distances legible. Focus styles and keyboard-friendly controls ensure
                    accessible navigation throughout the canvas.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge">High contrast labels</span>
                  <span className="badge">Keyboard ready</span>
                  <span className="badge">Large click targets</span>
                </div>
              </div>
            </div>
            <div className="panel p-0 overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/10">
              <DesignCanvas canvasRef={canvasRef} />
            </div>
          </section>

          {/* Right rail */}
          <aside className="space-y-4">
            <ElementPanel />
            <div className="panel space-y-3">
              <h3 className="font-semibold text-slate-800">Accessibility cues</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="badge bg-indigo-50 text-indigo-800 border-indigo-200">Focus</span>
                  <span>Every interactive control shows a strong focus ring for keyboard users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="badge bg-slate-100 text-slate-800 border-slate-200">Spacing</span>
                  <span>Generous padding and consistent card structure guide reading order.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="badge bg-emerald-50 text-emerald-800 border-emerald-200">Feedback</span>
                  <span>Stateful badges, measurements, and inline summaries keep status visible.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
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
