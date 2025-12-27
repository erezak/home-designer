import { useDesign } from '../context/DesignContext';
import { parseCm, MATERIAL_COLORS, type MaterialType } from '../types';

export function CanvasSettings() {
  const { state, setCanvas } = useDesign();
  const { canvas } = state;

  const materialOptions: MaterialType[] = ['drywall', 'wood', 'mdf', 'stone', 'metal'];

  return (
    <div className="space-y-6">
      <div>
        <h3 
          className="text-base font-medium mb-4" 
          style={{ 
            color: 'var(--color-text)', 
            letterSpacing: '-0.022em',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          Canvas
        </h3>
      
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Name
            </label>
            <input
              type="text"
              className="input-field"
              value={canvas.name}
              onChange={(e) => setCanvas({ name: e.target.value })}
            />
          </div>
          
          {/* Dimensions */}
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Dimensions (cm)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Width"
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
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Height"
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
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  placeholder="Depth"
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
          </div>
          
          {/* Material and Scale in two columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
              >
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
            
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
              >
                Scale
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
          </div>
          
          {/* Grid Settings - compact */}
          <div>
            <label 
              className="block text-sm font-medium mb-3" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Options
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={canvas.showGrid}
                  onChange={(e) => setCanvas({ showGrid: e.target.checked })}
                  className="rounded w-4 h-4"
                  style={{ 
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span 
                  className="text-sm" 
                  style={{ 
                    color: 'var(--color-text)', 
                    letterSpacing: '-0.011em',
                  }}
                >
                  Show Grid
                </span>
              </label>
              
              {canvas.showGrid && (
                <div className="ml-6.5 mt-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    placeholder="Grid size (cm)"
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
              
              <label className="flex items-center gap-2.5 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={canvas.snapToGrid}
                  onChange={(e) => setCanvas({ snapToGrid: e.target.checked })}
                  className="rounded w-4 h-4"
                  style={{ 
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span 
                  className="text-sm" 
                  style={{ 
                    color: 'var(--color-text)', 
                    letterSpacing: '-0.011em',
                  }}
                >
                  Snap to Grid
                </span>
              </label>
              
              <label className="flex items-center gap-2.5 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={canvas.snapToElements}
                  onChange={(e) => setCanvas({ snapToElements: e.target.checked })}
                  className="rounded w-4 h-4"
                  style={{ 
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span 
                  className="text-sm" 
                  style={{ 
                    color: 'var(--color-text)', 
                    letterSpacing: '-0.011em',
                  }}
                >
                  Snap to Elements
                </span>
              </label>
              
              <label className="flex items-center gap-2.5 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={canvas.autoPosition}
                  onChange={(e) => setCanvas({ autoPosition: e.target.checked })}
                  className="rounded w-4 h-4"
                  style={{ 
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span 
                  className="text-sm" 
                  style={{ 
                    color: 'var(--color-text)', 
                    letterSpacing: '-0.011em',
                  }}
                >
                  Auto-position
                </span>
              </label>
              
              <label className="flex items-center gap-2.5 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={canvas.showAllDistances}
                  onChange={(e) => setCanvas({ showAllDistances: e.target.checked })}
                  className="rounded w-4 h-4"
                  style={{ 
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <span 
                  className="text-sm" 
                  style={{ 
                    color: 'var(--color-text)', 
                    letterSpacing: '-0.011em',
                  }}
                >
                  Show Distances
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
