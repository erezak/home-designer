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
    <div className="panel">
      <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
        Area Pulse
        <span className="px-2 py-0.5 text-xs font-black bg-[#7cf0ff] border-2 border-black rounded-md">
          Metrics
        </span>
      </h3>
      
      <div className="space-y-3">
        {/* Wall Area */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#0f172a] uppercase tracking-[0.08em]">Wall Area</span>
          <span className="text-base font-black text-[#0b0b0b]">
            {formatArea(wallArea)}
          </span>
        </div>
        
        {/* Wall Dimensions */}
        <div className="text-xs text-[#475569] -mt-2 uppercase tracking-[0.12em] font-semibold">
          {formatCm(state.canvas.dimensions.width)} × {formatCm(state.canvas.dimensions.height)} cm
        </div>
        
        {/* Niches Area */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#0f172a] uppercase tracking-[0.08em]">
            Niches ({nicheCount})
          </span>
          <span className="text-base font-black text-[#0b0b0b]">
            {formatArea(nichesArea)}
          </span>
        </div>
        
        {/* Net Wall Area (Wall - Niches) */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-black text-[#0f172a] uppercase tracking-[0.08em]">Net Wall</span>
          <span className="text-base font-black text-[#ef4444]">
            {formatArea(wallArea - nichesArea)}
          </span>
        </div>
        
        {/* Niches percentage */}
        {nichesArea > 0 && (
          <div className="text-xs text-[#475569] -mt-1 uppercase tracking-[0.1em]">
            Niches: {((nichesArea / wallArea) * 100).toFixed(1)}% of wall
          </div>
        )}
      </div>
    </div>
  );
}
