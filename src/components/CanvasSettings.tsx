import { useDesign } from '../context/DesignContext';
import { useTranslation } from '../context/TranslationContext';
import { parseCm, MATERIAL_COLORS, type MaterialType } from '../types';

export function CanvasSettings() {
  const { state, setCanvas } = useDesign();
  const { t } = useTranslation();
  const { canvas } = state;

  const materialOptions: MaterialType[] = ['drywall', 'wood', 'mdf', 'stone', 'metal'];

  const getMaterialName = (mat: MaterialType) => {
    const materialMap: Record<MaterialType, string> = {
      drywall: t.materials.drywall,
      wood: t.materials.wood,
      glass: t.materials.glass,
      metal: t.materials.metal,
      stone: t.materials.stone,
      mdf: t.materials.mdf,
    };
    return materialMap[mat];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="panel-header">{t.canvasSettings.title}</h3>
      </div>
      
      {/* Name */}
      <div className="panel">
        <label 
          className="block text-xs font-bold uppercase tracking-wide mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t.canvasSettings.designName}
        </label>
        <input
          type="text"
          className="input-field"
          value={canvas.name}
          onChange={(e) => setCanvas({ name: e.target.value })}
          placeholder={t.canvasSettings.designNamePlaceholder}
        />
      </div>
      
      {/* Dimensions - Hero Card */}
      <div className="panel">
        <label 
          className="block text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t.canvasSettings.dimensions}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {t.canvasSettings.width}
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
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {t.canvasSettings.height}
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
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {t.canvasSettings.depth}
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
      </div>
      
      {/* Material & Scale */}
      <div className="panel space-y-4">
        <div>
          <label 
            className="block text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.canvasSettings.material}
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
                {getMaterialName(mat)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            className="block text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.canvasSettings.scale}
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
      
      {/* Grid Settings */}
      <div className="panel space-y-3">
        <label 
          className="block text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t.canvasSettings.gridOptions}
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={canvas.showGrid}
            onChange={(e) => setCanvas({ showGrid: e.target.checked })}
            className="w-5 h-5 rounded border-2 cursor-pointer"
            style={{ 
              borderColor: 'var(--color-border-strong)',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span 
            className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t.canvasSettings.showGrid}
          </span>
        </label>
        
        {canvas.showGrid && (
          <div className="ml-8">
            <label 
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {t.canvasSettings.gridSize}
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
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={canvas.snapToGrid}
            onChange={(e) => setCanvas({ snapToGrid: e.target.checked })}
            className="w-5 h-5 rounded border-2 cursor-pointer"
            style={{ 
              borderColor: 'var(--color-border-strong)',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span 
            className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t.canvasSettings.snapToGrid}
          </span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={canvas.snapToElements}
            onChange={(e) => setCanvas({ snapToElements: e.target.checked })}
            className="w-5 h-5 rounded border-2 cursor-pointer"
            style={{ 
              borderColor: 'var(--color-border-strong)',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span 
            className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t.canvasSettings.snapToElements}
          </span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={canvas.autoPosition}
            onChange={(e) => setCanvas({ autoPosition: e.target.checked })}
            className="w-5 h-5 rounded border-2 cursor-pointer"
            style={{ 
              borderColor: 'var(--color-border-strong)',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span 
            className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t.canvasSettings.autoPosition}
          </span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={canvas.showAllDistances}
            onChange={(e) => setCanvas({ showAllDistances: e.target.checked })}
            className="w-5 h-5 rounded border-2 cursor-pointer"
            style={{ 
              borderColor: 'var(--color-border-strong)',
              accentColor: 'var(--color-primary)'
            }}
          />
          <span 
            className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t.canvasSettings.showAllDistances}
          </span>
        </label>
      </div>
    </div>
  );
}
