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

// Calculate horizontal and vertical gaps between elements
interface Gap {
  start: number; // cm
  end: number; // cm
  size: number; // cm
  position: number; // cm (perpendicular axis position)
  direction: 'horizontal' | 'vertical';
}

// Gap calculation constants
const MAX_PROXIMITY_GAP = 100; // cm - maximum distance to consider elements as neighbors
const MIN_GAP_SIZE = 0.5; // cm - minimum gap size to display

function calculateGaps(
  elements: DesignElement[],
  _canvasWidth: number,
  _canvasHeight: number,
  viewType: 'elevation' | 'plan'
): Gap[] {
  if (elements.length === 0) return [];

  const gaps: Gap[] = [];
  const processedPairs = new Set<string>();

  // For each element, find gaps to its nearest neighbors in all directions
  for (const element of elements) {
    const pos = element.computedPosition || { x: 0, y: 0 };
    const width = element.dimensions.width;
    const height = viewType === 'elevation' ? element.dimensions.height : (element.depth || 10);
    
    const right = pos.x + width;
    const bottom = pos.y + height;
    
    // Find nearest element to the right
    let nearestRight: { element: DesignElement; gap: number } | null = null;
    for (const other of elements) {
      if (other.id === element.id) continue;
      const otherPos = other.computedPosition || { x: 0, y: 0 };
      
      // Check if other is to the right
      if (otherPos.x > right) {
        const gap = otherPos.x - right;
        const otherHeight = viewType === 'elevation' ? other.dimensions.height : (other.depth || 10);
        const otherBottom = otherPos.y + otherHeight;
        
        // Check for vertical proximity (elements should be somewhat aligned vertically)
        const verticalGap = Math.max(0, Math.max(pos.y - otherBottom, otherPos.y - bottom));
        
        if (verticalGap < MAX_PROXIMITY_GAP && (!nearestRight || gap < nearestRight.gap)) {
          nearestRight = { element: other, gap };
        }
      }
    }
    
    // Add horizontal gap if found
    if (nearestRight && nearestRight.gap > MIN_GAP_SIZE) {
      const pairKey = `h-${element.id}-${nearestRight.element.id}`;
      const reversePairKey = `h-${nearestRight.element.id}-${element.id}`;
      
      if (!processedPairs.has(pairKey) && !processedPairs.has(reversePairKey)) {
        processedPairs.add(pairKey);
        
        // Calculate vertical center between the two elements
        const otherPos = nearestRight.element.computedPosition || { x: 0, y: 0 };
        const otherHeight = viewType === 'elevation' ? nearestRight.element.dimensions.height : (nearestRight.element.depth || 10);
        
        const minTop = Math.min(pos.y, otherPos.y);
        const maxBottom = Math.max(bottom, otherPos.y + otherHeight);
        const centerY = (minTop + maxBottom) / 2;
        
        const gap = {
          start: right,
          end: otherPos.x,
          size: nearestRight.gap,
          position: centerY,
          direction: 'horizontal' as const
        };
        gaps.push(gap);
      }
    }
    
    // Find nearest element below
    let nearestBelow: { element: DesignElement; gap: number } | null = null;
    for (const other of elements) {
      if (other.id === element.id) continue;
      const otherPos = other.computedPosition || { x: 0, y: 0 };
      
      // Check if other is below
      if (otherPos.y > bottom) {
        const gap = otherPos.y - bottom;
        const otherRight = otherPos.x + other.dimensions.width;
        
        // Check for horizontal proximity (elements should be somewhat aligned horizontally)
        const horizontalGap = Math.max(0, Math.max(pos.x - otherRight, otherPos.x - right));
        
        if (horizontalGap < MAX_PROXIMITY_GAP && (!nearestBelow || gap < nearestBelow.gap)) {
          nearestBelow = { element: other, gap };
        }
      }
    }
    
    // Add vertical gap if found
    if (nearestBelow && nearestBelow.gap > MIN_GAP_SIZE) {
      const pairKey = `v-${element.id}-${nearestBelow.element.id}`;
      const reversePairKey = `v-${nearestBelow.element.id}-${element.id}`;
      
      if (!processedPairs.has(pairKey) && !processedPairs.has(reversePairKey)) {
        processedPairs.add(pairKey);
        
        // Calculate horizontal center between the two elements
        const otherPos = nearestBelow.element.computedPosition || { x: 0, y: 0 };
        const otherWidth = nearestBelow.element.dimensions.width;
        
        const minLeft = Math.min(pos.x, otherPos.x);
        const maxRight = Math.max(right, otherPos.x + otherWidth);
        const centerX = (minLeft + maxRight) / 2;
        
        const gap = {
          start: bottom,
          end: otherPos.y,
          size: nearestBelow.gap,
          position: centerX,
          direction: 'vertical' as const
        };
        gaps.push(gap);
      }
    }
  }

  return gaps;
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
  
  // Calculate gaps between elements
  const gaps = useMemo(() => {
    if (!state.canvas.showAllDistances || flattenedElements.length === 0) return [];
    
    return calculateGaps(
      flattenedElements,
      state.canvas.dimensions.width,
      state.activeView === 'elevation' ? state.canvas.dimensions.height : state.canvas.dimensions.depth,
      state.activeView
    );
  }, [flattenedElements, state.canvas.dimensions, state.activeView, state.canvas.showAllDistances]);
  
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
              
              {/* Render gap measurements (empty wall spaces) */}
              {state.canvas.showAllDistances && gaps.map((gap, index) => {
                const isHorizontal = gap.direction === 'horizontal';
                const startPx = toPixels(gap.start);
                const sizePx = toPixels(gap.size);
                const positionPx = toPixels(gap.position);
                
                return (
                  <div
                    key={`gap-${index}`}
                    className="absolute pointer-events-none"
                    style={{
                      [isHorizontal ? 'left' : 'top']: startPx,
                      [isHorizontal ? 'width' : 'height']: sizePx,
                      [isHorizontal ? 'top' : 'left']: positionPx - 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 50,
                    }}
                  >
                    <span className="bg-green-600 text-white text-xs px-1 rounded whitespace-nowrap">
                      {isHorizontal ? '↔' : '↕'} {formatCm(gap.size)}
                    </span>
                  </div>
                );
              })}
              
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
