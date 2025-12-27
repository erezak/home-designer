import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="panel flex flex-wrap items-center gap-4 justify-between no-print sticky top-4 z-20">
      {/* Left: Brand & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 to-indigo-500 flex items-center justify-center text-indigo-900 font-bold shadow-inner">
            HD
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-tight">Home Designer</p>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              Soft Card Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1">
          <button
            onClick={() => setView('elevation')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              state.activeView === 'elevation'
                ? 'bg-white shadow-md text-indigo-700'
                : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              state.activeView === 'plan'
                ? 'bg-white shadow-md text-indigo-700'
                : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            Plan
          </button>
        </div>
      </div>

      {/* Center: Title */}
      <div className="text-center flex-1 min-w-[200px]">
        <h1 className="text-xl font-semibold text-slate-900">{state.canvas.name}</h1>
        <p className="text-xs text-slate-500">Optimistic, airy layout with soft cards</p>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-2">
        <span className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Zoom</span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 font-medium transition"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-sm text-slate-800 w-12 text-center font-semibold">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 font-medium transition"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
