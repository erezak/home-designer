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
          Summary
        </h3>
        
        <div className="space-y-3.5">
          {/* Wall Area */}
          <div className="flex justify-between items-baseline">
            <span 
              className="text-sm" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Wall Area
            </span>
            <span 
              className="text-sm font-medium" 
              style={{ color: 'var(--color-text)', letterSpacing: '-0.011em' }}
            >
              {formatArea(wallArea)}
            </span>
          </div>
          
          {/* Wall Dimensions */}
          <div className="text-xs" style={{ color: 'var(--color-text-muted)', marginTop: '-0.5rem' }}>
            {formatCm(state.canvas.dimensions.width)} × {formatCm(state.canvas.dimensions.height)} cm
          </div>
          
          {/* Niches Area */}
          <div className="flex justify-between items-baseline">
            <span 
              className="text-sm" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Niches ({nicheCount})
            </span>
            <span 
              className="text-sm font-medium" 
              style={{ color: 'var(--color-text)', letterSpacing: '-0.011em' }}
            >
              {formatArea(nichesArea)}
            </span>
          </div>
          
          {/* Net Wall Area (Wall - Niches) */}
          <div 
            className="flex justify-between items-baseline pt-3" 
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <span 
              className="text-sm font-medium" 
              style={{ color: 'var(--color-text)', letterSpacing: '-0.011em' }}
            >
              Net Wall
            </span>
            <span 
              className="text-sm font-semibold" 
              style={{ color: 'var(--color-accent)', letterSpacing: '-0.011em' }}
            >
              {formatArea(wallArea - nichesArea)}
            </span>
          </div>
          
          {/* Niches percentage */}
          {nichesArea > 0 && (
            <div className="text-xs" style={{ color: 'var(--color-text-muted)', marginTop: '-0.25rem' }}>
              {((nichesArea / wallArea) * 100).toFixed(1)}% of wall
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
