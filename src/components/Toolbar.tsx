import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="bg-[#0b0b0b] text-[#fefae0] border-4 border-black rounded-xl shadow-[12px_12px_0_#ffde34] px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 no-print">
      {/* Left: View Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 text-[11px] tracking-[0.2em] uppercase font-black bg-[#fefae0] text-black border-2 border-black rounded-md shadow-[6px_6px_0_#ffde34]">
          View
        </span>
        <button
          onClick={() => setView('elevation')}
          className={`px-4 py-2 text-sm font-bold uppercase tracking-tight border-2 border-black rounded-lg shadow-[6px_6px_0_#111] transition-colors ${
            state.activeView === 'elevation'
              ? 'bg-[#ffde34] text-black'
              : 'bg-[#111827] text-white hover:bg-[#0d1425]'
          }`}
        >
          Elevation
        </button>
        <button
          onClick={() => setView('plan')}
          className={`px-4 py-2 text-sm font-bold uppercase tracking-tight border-2 border-black rounded-lg shadow-[6px_6px_0_#111] transition-colors ${
            state.activeView === 'plan'
              ? 'bg-[#ffde34] text-black'
              : 'bg-[#111827] text-white hover:bg-[#0d1425]'
          }`}
        >
          Plan
        </button>
      </div>

      {/* Center: Title */}
      <div className="text-left md:text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-[#94a3b8] font-semibold">Current Scene</p>
        <h1 className="text-xl font-black text-[#fefae0] leading-tight">{state.canvas.name}</h1>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2 bg-[#fefae0] text-[#0b0b0b] px-3 py-2 border-2 border-black rounded-lg shadow-[6px_6px_0_#ffde34]">
        <span className="text-[11px] uppercase tracking-[0.16em] font-bold">Zoom</span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-9 h-9 rounded-md bg-[#111827] text-white font-black border-2 border-black hover:bg-[#0d1425]"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-sm font-black w-12 text-center">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-9 h-9 rounded-md bg-[#111827] text-white font-black border-2 border-black hover:bg-[#0d1425]"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-2 px-3 py-1 text-xs font-black uppercase bg-[#ffde34] border-2 border-black rounded-md shadow-[4px_4px_0_#111]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
