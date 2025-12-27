import { useMemo } from 'react';
import { useDesign } from '../context/DesignContext';
import { type DesignElement, formatCm } from '../types';

// Format area in square centimeters or square meters
function formatArea(areaCm2: number): string {
  if (areaCm2 >= 10000) {
    // Convert to m² for large areas
    return `${(areaCm2 / 10000).toFixed(2)} m²`;
  }
  return `${areaCm2.toFixed(2)} cm²`;
}

// Flatten all elements recursively
function flattenElements(elements: DesignElement[]): DesignElement[] {
  const result: DesignElement[] = [];
  const flatten = (els: DesignElement[]) => {
    for (const el of els) {
      result.push(el);
      if (el.children.length > 0) {
        flatten(el.children);
      }
    }
  };
  flatten(elements);
  return result;
}

export function AreaSummary() {
  const { state } = useDesign();
  
  // Calculate areas
  const { wallArea, nichesArea, nicheCount } = useMemo(() => {
    // Wall area = canvas width × height
    const wall = state.canvas.dimensions.width * state.canvas.dimensions.height;
    
    // Get all niches (including nested ones)
    const allElements = flattenElements(state.elements);
    const niches = allElements.filter((el) => el.type === 'niche');
    
    // Sum of all niche areas
    const nichesTotal = niches.reduce((sum, niche) => {
      return sum + niche.dimensions.width * niche.dimensions.height;
    }, 0);
    
    return {
      wallArea: wall,
      nichesArea: nichesTotal,
      nicheCount: niches.length,
    };
  }, [state.canvas.dimensions, state.elements]);
  
  return (
    <div>
      <h3 className="panel-header">Area Summary</h3>
      
      <div className="panel space-y-4">
        {/* Wall Area - Hero Stats */}
        <div 
          className="p-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
            color: 'var(--color-text-inverse)'
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wide opacity-90">
              Total Wall Area
            </span>
            <span className="text-2xl font-extrabold">
              {formatArea(wallArea)}
            </span>
          </div>
          <div className="text-xs mt-2 opacity-80 font-semibold">
            {formatCm(state.canvas.dimensions.width)} × {formatCm(state.canvas.dimensions.height)} cm
          </div>
        </div>
        
        {/* Niches Area */}
        <div className="flex justify-between items-center">
          <span 
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Niches ({nicheCount})
          </span>
          <span 
            className="text-lg font-bold"
            style={{ color: 'var(--color-accent)' }}
          >
            {formatArea(nichesArea)}
          </span>
        </div>
        
        {/* Net Wall Area (Wall - Niches) */}
        <div 
          className="pt-3 border-t-2"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex justify-between items-center">
            <span 
              className="text-sm font-bold uppercase tracking-wide"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Net Area
            </span>
            <span 
              className="text-xl font-extrabold"
              style={{ color: 'var(--color-success)' }}
            >
              {formatArea(wallArea - nichesArea)}
            </span>
          </div>
        </div>
        
        {/* Niches percentage */}
        {nichesArea > 0 && (
          <div 
            className="text-xs font-semibold pt-2"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Niches coverage: {((nichesArea / wallArea) * 100).toFixed(1)}% of wall
          </div>
        )}
      </div>
    </div>
  );
}
