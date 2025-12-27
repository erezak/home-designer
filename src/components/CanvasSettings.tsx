import { useDesign } from '../context/DesignContext';
import { parseCm, MATERIAL_COLORS, type MaterialType } from '../types';

export function CanvasSettings() {
  const { state, setCanvas } = useDesign();
  const { canvas } = state;

  const materialOptions: MaterialType[] = ['drywall', 'wood', 'mdf', 'stone', 'metal'];

  return (
    <div className="panel space-y-4">
      <h3 className="font-semibold text-white border-b border-white/10 pb-2">Canvas Settings</h3>
      
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Design Name
        </label>
        <input
          type="text"
          className="input-field"
          value={canvas.name}
          onChange={(e) => setCanvas({ name: e.target.value })}
        />
      </div>
      
      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Width (cm)
          </label>
          <input
            type="text"
            inputMode="decimal"
            className="input-field"
            defaultValue={canvas.dimensions.width}
            onBlur={(e) => setCanvas({
              dimensions: { ...canvas.dimensions, width: parseCm(e.target.value) }
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Height (cm)
          </label>
          <input
            type="text"
            inputMode="decimal"
            className="input-field"
            defaultValue={canvas.dimensions.height}
            onBlur={(e) => setCanvas({
              dimensions: { ...canvas.dimensions, height: parseCm(e.target.value) }
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Depth (cm)
          </label>
          <input
            type="text"
            inputMode="decimal"
            className="input-field"
            defaultValue={canvas.dimensions.depth}
            onBlur={(e) => setCanvas({
              dimensions: { ...canvas.dimensions, depth: parseCm(e.target.value) }
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
        </div>
      </div>
      
      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Material
        </label>
        <select
          className="input-field"
          value={canvas.material.type}
          onChange={(e) => {
            const type = e.target.value as MaterialType;
            setCanvas({
              material: { type, color: MATERIAL_COLORS[type] }
            });
          }}
        >
          {materialOptions.map((mat) => (
            <option key={mat} value={mat}>
              {mat.charAt(0).toUpperCase() + mat.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Scale */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Scale (1:X)
        </label>
        <select
          className="input-field"
          value={canvas.scale}
          onChange={(e) => setCanvas({ scale: parseInt(e.target.value) })}
        >
          <option value="10">1:10</option>
          <option value="20">1:20</option>
          <option value="25">1:25</option>
          <option value="50">1:50</option>
          <option value="100">1:100</option>
        </select>
      </div>
      
      {/* Grid Settings */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canvas.showGrid}
            onChange={(e) => setCanvas({ showGrid: e.target.checked })}
            className="rounded border-white/30 bg-white/5"
          />
          <span className="text-sm text-slate-200">Show Grid</span>
        </label>
        
        {canvas.showGrid && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Grid Size (cm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              className="input-field"
              defaultValue={canvas.gridSize}
              onBlur={(e) => setCanvas({ gridSize: parseCm(e.target.value) })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        )}
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canvas.snapToGrid}
            onChange={(e) => setCanvas({ snapToGrid: e.target.checked })}
            className="rounded border-white/30 bg-white/5"
          />
          <span className="text-sm text-slate-200">Snap to Grid</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canvas.snapToElements}
            onChange={(e) => setCanvas({ snapToElements: e.target.checked })}
            className="rounded border-white/30 bg-white/5"
          />
          <span className="text-sm text-slate-200">Snap to Elements</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canvas.autoPosition}
            onChange={(e) => setCanvas({ autoPosition: e.target.checked })}
            className="rounded border-white/30 bg-white/5"
          />
          <span className="text-sm text-slate-200">Auto-position Elements</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canvas.showAllDistances}
            onChange={(e) => setCanvas({ showAllDistances: e.target.checked })}
            className="rounded border-white/30 bg-white/5"
          />
          <span className="text-sm text-slate-200">Show All Distances</span>
        </label>
      </div>
    </div>
  );
}
