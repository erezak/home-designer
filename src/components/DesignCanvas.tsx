import { useRef, useMemo } from 'react';
import { useDesign } from '../context/DesignContext';
import { ElementRenderer } from './ElementRenderer';
import { formatCm, type DesignElement } from '../types';

interface DesignCanvasProps {
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

// Flatten all elements (including nested children) for rendering
// This ensures absolute positioning always works from canvas origin
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

export function DesignCanvas({ canvasRef }: DesignCanvasProps) {
  const { state, selectElement } = useDesign();
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = canvasRef || internalRef;
  
  // Convert cm to pixels based on scale
  const toPixels = (cm: number) => (cm / state.canvas.scale) * 50;
  
  const canvasWidth = toPixels(state.canvas.dimensions.width);
  const canvasHeight = state.activeView === 'elevation'
    ? toPixels(state.canvas.dimensions.height)
    : toPixels(state.canvas.dimensions.depth);
  
  const gridSizePixels = toPixels(state.canvas.gridSize);
  
  // Flatten all elements for rendering - this ensures absolute positioning
  // always works from canvas origin, not relative to parent elements
  const flattenedElements = useMemo(() => flattenElements(state.elements), [state.elements]);
  
  return (
    <div className="flex-1 overflow-auto bg-gray-200 p-8">
      {/* View Title */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          {state.activeView === 'elevation' ? 'Front Elevation View' : 'Top-Down Plan View'}
        </h2>
        <p className="text-sm text-gray-500">
          Scale 1:{state.canvas.scale} | Canvas: {formatCm(state.canvas.dimensions.width)} × {' '}
          {state.activeView === 'elevation' 
            ? formatCm(state.canvas.dimensions.height)
            : formatCm(state.canvas.dimensions.depth)} cm
        </p>
      </div>
      
      {/* Wrapper to ensure canvas is scrollable with proper padding for measurements */}
      <div 
        className="inline-block min-w-full"
        style={{ 
          transform: `scale(${state.zoom})`, 
          transformOrigin: 'top center',
        }}
      >
        <div className="flex justify-center">
          {/* Padding wrapper for measurement labels */}
          <div className="relative" style={{ padding: '40px 60px 40px 70px' }}>
            {/* Canvas container */}
            <div
              ref={ref}
              className="relative bg-white shadow-lg"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                minWidth: canvasWidth,
                minHeight: canvasHeight,
                backgroundColor: state.canvas.material.color || '#e5e5e5',
                overflow: 'hidden', // Clip elements to canvas bounds
                ...(state.canvas.showGrid && {
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSizePixels}px ${gridSizePixels}px`,
                }),
              }}
              onClick={() => selectElement(null)}
            >
              {/* Canvas border with measurements */}
              <div className="absolute inset-0 border-2 border-gray-400 pointer-events-none" style={{ zIndex: 500 }} />
              
              {/* Render all elements (flattened) */}
              {flattenedElements.map((element) => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  scale={state.canvas.scale}
                  isSelected={element.id === state.selectedElementId}
                  onSelect={selectElement}
                  viewType={state.activeView}
                  siblingElements={flattenedElements}
                  canvasDimensions={{
                    width: state.canvas.dimensions.width,
                    height: state.activeView === 'elevation' 
                      ? state.canvas.dimensions.height 
                      : state.canvas.dimensions.depth
                  }}
                  showAllDistances={state.canvas.showAllDistances}
                />
              ))}
              
              {/* Empty state */}
              {state.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-lg">No elements yet</p>
                    <p className="text-sm">Add elements from the sidebar</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Width measurement at top - positioned outside canvas */}
            <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none" style={{ paddingLeft: 70, paddingRight: 60 }}>
              <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded">
                {formatCm(state.canvas.dimensions.width)} cm
              </span>
            </div>
            
            {/* Height measurement at left - positioned outside canvas */}
            <div className="absolute left-2 top-0 bottom-0 flex items-center pointer-events-none" style={{ paddingTop: 40, paddingBottom: 40 }}>
              <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap -rotate-90">
                {formatCm(state.activeView === 'elevation' 
                  ? state.canvas.dimensions.height 
                  : state.canvas.dimensions.depth)} cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
