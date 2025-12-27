import { useRef } from 'react';
import { DesignProvider, useDesign } from './context/DesignContext';
import {
  DesignCanvas,
  CanvasSettings,
  ElementPanel,
  Toolbar,
  ExportPanel,
  AreaSummary,
} from './components';
import { formatCm } from './types';

function AppContent() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { state } = useDesign();
  const sectionNav = [
    { id: 'overview', label: 'Brief' },
    { id: 'canvas', label: 'Canvas' },
    { id: 'library', label: 'Library' },
    { id: 'exports', label: 'Exports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-6 lg:sticky lg:top-8 h-fit no-print">
            <div className="panel">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Idea 06 · Editorial</p>
              <h1 className="mt-3 text-4xl leading-tight text-stone-900">
                Home Designer Journal
              </h1>
              <p className="mt-3 text-sm text-stone-600">
                A publication-inspired studio where measured walls become layouts, grids, and stories you can export.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-stone-900 text-stone-50 px-3 py-1 text-xs font-semibold">
                  View · {state.activeView === 'elevation' ? 'Elevation' : 'Plan'}
                </span>
                <span className="rounded-full bg-stone-100 text-stone-800 px-3 py-1 text-xs">
                  Scale 1:{state.canvas.scale}
                </span>
                <span className="rounded-full bg-stone-100 text-stone-800 px-3 py-1 text-xs">
                  {formatCm(state.canvas.dimensions.width)} × {state.activeView === 'elevation'
                    ? formatCm(state.canvas.dimensions.height)
                    : formatCm(state.canvas.dimensions.depth)} cm
                </span>
              </div>
            </div>

            <div className="panel">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Sections</p>
              <div className="space-y-2">
                {sectionNav.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center justify-between rounded-2xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:border-stone-400 hover:-translate-y-0.5 transition"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span aria-hidden>→</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="panel">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Reading notes</p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>Arrange the canvas first, then layer niches, shelves, or recesses like sidebars.</li>
                <li>Use plan view to align depths and spacing; elevate to proof proportions.</li>
                <li>Exports are paced for handoff—PDF for narrative, PNG for snapshots, JSON/YAML for data.</li>
              </ul>
            </div>
          </aside>

          <main className="space-y-10">
            <section id="overview" className="panel overflow-hidden">
              <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Editorial Direction</p>
                  <h2 className="text-3xl md:text-4xl leading-tight text-stone-900">
                    A calm studio with columned rhythm and typographic hierarchy
                  </h2>
                  <p className="mt-3 text-stone-600 text-sm md:text-base">
                    The interface reads like a well-set spread: strong titles, clear columns, restrained accents. Move
                    between elevation and plan like turning a page, while the grid keeps every measure intentional.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-inner">
                  <Toolbar />
                </div>
              </div>
            </section>

            <section id="canvas" className="panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Studio Canvas</p>
                  <h3 className="text-2xl font-semibold text-stone-900">
                    {state.activeView === 'elevation' ? 'Front elevation story' : 'Planimetric study'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                  <span className="rounded-full bg-stone-100 px-3 py-1">Scale 1:{state.canvas.scale}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">
                    {formatCm(state.canvas.dimensions.width)} × {state.activeView === 'elevation'
                      ? formatCm(state.canvas.dimensions.height)
                      : formatCm(state.canvas.dimensions.depth)} cm
                  </span>
                </div>
              </div>
              <div className="mt-4 -mx-5 md:-mx-6 lg:-mx-8 bg-stone-100 border border-stone-200 rounded-3xl overflow-hidden">
                <DesignCanvas canvasRef={canvasRef} />
              </div>
            </section>

            <section id="library" className="space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Library</p>
                  <h3 className="text-2xl font-semibold text-stone-900">Composition Library</h3>
                  <p className="text-sm text-stone-600">Add, nest, and tune elements with a typographic editor feel.</p>
                </div>
                <span className="hidden sm:inline-block rounded-full bg-stone-900 text-stone-50 px-3 py-1 text-xs">
                  {state.elements.length} elements
                </span>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="panel">
                  <ElementPanel />
                </div>
                <div className="space-y-6">
                  <CanvasSettings />
                  <AreaSummary />
                </div>
              </div>
            </section>

            <section id="exports" className="panel">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Outputs</p>
                  <h3 className="text-2xl font-semibold text-stone-900">Export & Archive</h3>
                  <p className="text-sm text-stone-600">Choose your format—an editorial PDF, a lightweight PNG, or structured data.</p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr] items-start">
                <ExportPanel canvasRef={canvasRef} />
                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 text-sm text-stone-700">
                  <h4 className="text-lg font-semibold text-stone-900 mb-2">Hand-off guidance</h4>
                  <p className="mb-3">
                    Use PDF when you need measurements side-by-side with imagery. PNG suits quick editorial teasers or moodboards.
                    JSON/YAML preserves structure so teams can version, diff, or automate specifications.
                  </p>
                  <p className="text-stone-600">
                    The print layout remains quiet—no chrome, just canvas and labels—so physical markups feel intentional.
                  </p>
                </div>
              </div>
            </section>
          </main>
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
