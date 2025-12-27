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

export function AreaSummary({ variant = 'panel' }: { variant?: 'panel' | 'inline' } = {}) {
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
  
  const isInline = variant === 'inline';
  const containerClass = isInline ? 'space-y-2' : 'panel';

  return (
    <div className={containerClass}>
      <h3
        className={`font-semibold ${
          isInline ? 'text-slate-100' : 'text-gray-800 border-b pb-2 mb-3'
        }`}
      >
        Area Summary
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isInline ? 'text-slate-300' : 'text-gray-600'}`}>Wall Area:</span>
          <span className={`text-sm font-medium ${isInline ? 'text-slate-50' : 'text-gray-800'}`}>
            {formatArea(wallArea)}
          </span>
        </div>
        
        <div className={`text-xs ${isInline ? 'text-slate-500' : 'text-gray-500'} -mt-2`}>
          {formatCm(state.canvas.dimensions.width)} × {formatCm(state.canvas.dimensions.height)} cm
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isInline ? 'text-slate-300' : 'text-gray-600'}`}>
            Niches Area ({nicheCount}):
          </span>
          <span className={`text-sm font-medium ${isInline ? 'text-slate-50' : 'text-gray-800'}`}>
            {formatArea(nichesArea)}
          </span>
        </div>
        
        <div className={`flex justify-between items-center pt-2 ${isInline ? 'border-t border-slate-800' : 'border-t'}`}>
          <span className={`text-sm font-medium ${isInline ? 'text-slate-200' : 'text-gray-600'}`}>Net Wall Area:</span>
          <span className={`text-sm font-semibold ${isInline ? 'text-emerald-300' : 'text-blue-600'}`}>
            {formatArea(wallArea - nichesArea)}
          </span>
        </div>
        
        {nichesArea > 0 && (
          <div className={`text-xs ${isInline ? 'text-slate-500' : 'text-gray-500'} -mt-1`}>
            Niches: {((nichesArea / wallArea) * 100).toFixed(1)}% of wall
          </div>
        )}
      </div>
    </div>
  );
}
