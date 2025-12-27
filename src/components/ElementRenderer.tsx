import { useState, useRef, useCallback, useMemo } from 'react';
import { useDesign } from '../context/DesignContext';
import { type DesignElement, MATERIAL_COLORS, formatCm } from '../types';

interface ElementRendererProps {
  element: DesignElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  showMeasurements?: boolean;
  viewType: 'elevation' | 'plan';
  siblingElements?: DesignElement[]; // Other elements at the same level
  canvasDimensions?: { width: number; height: number }; // Canvas size for edge distances
  showAllDistances?: boolean; // Show distance markers for all elements
}

export function ElementRenderer({
  element,
  isSelected,
  onSelect,
  showMeasurements = true,
  viewType,
  siblingElements = [],
  canvasDimensions,
  showAllDistances = false,
}: ElementRendererProps) {
  const { state, moveElement } = useDesign();
  const position = useMemo(() => element.computedPosition || { x: 0, y: 0 }, [element.computedPosition]);
  
  // Use canvas dimensions from props or from state
  const canvasWidth = canvasDimensions?.width ?? state.canvas.dimensions.width;
  const canvasHeight = canvasDimensions?.height ?? (viewType === 'elevation' 
    ? state.canvas.dimensions.height 
    : state.canvas.dimensions.depth);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Scale factor for conversions
  const scaleFactor = state.canvas.scale;
  const gridSize = state.canvas.gridSize;
  const snapEnabled = state.canvas.snapToGrid;
  
  // Convert cm to pixels based on scale
  const toPixels = useCallback((cm: number) => (cm / scaleFactor) * 50, [scaleFactor]);
  const toCm = useCallback((px: number) => (px / 50) * scaleFactor, [scaleFactor]);
  
  const elWidth = element.dimensions.width;
  const elHeight = viewType === 'elevation' ? element.dimensions.height : (element.depth || 10);
  
  const width = toPixels(elWidth);
  const height = toPixels(elHeight);
  const x = toPixels(position.x);
  const y = toPixels(position.y);
  
  const materialColor = element.material.color || MATERIAL_COLORS[element.material.type];

  // Calculate distances to edges and nearest elements
  const distances = useMemo(() => {
    const pos = position;
    const result = {
      left: pos.x, // Distance from left edge
      top: pos.y, // Distance from top edge
      right: canvasWidth - (pos.x + elWidth), // Distance from right edge
      bottom: canvasHeight - (pos.y + elHeight), // Distance from bottom edge
      nearestLeft: null as { distance: number; element: DesignElement } | null,
      nearestRight: null as { distance: number; element: DesignElement } | null,
      nearestTop: null as { distance: number; element: DesignElement } | null,
      nearestBottom: null as { distance: number; element: DesignElement } | null,
    };

    // Find nearest sibling elements
    for (const sibling of siblingElements) {
      if (sibling.id === element.id) continue;
      const sibPos = sibling.computedPosition || { x: 0, y: 0 };
      const sibWidth = sibling.dimensions.width;
      const sibHeight = viewType === 'elevation' ? sibling.dimensions.height : (sibling.depth || 10);

      // Check if horizontally overlapping (for vertical distance)
      const hOverlap = pos.x < sibPos.x + sibWidth && pos.x + elWidth > sibPos.x;
      // Check if vertically overlapping (for horizontal distance)
      const vOverlap = pos.y < sibPos.y + sibHeight && pos.y + elHeight > sibPos.y;

      // Element to the left
      if (vOverlap && sibPos.x + sibWidth <= pos.x) {
        const dist = pos.x - (sibPos.x + sibWidth);
        if (!result.nearestLeft || dist < result.nearestLeft.distance) {
          result.nearestLeft = { distance: dist, element: sibling };
        }
      }

      // Element to the right
      if (vOverlap && sibPos.x >= pos.x + elWidth) {
        const dist = sibPos.x - (pos.x + elWidth);
        if (!result.nearestRight || dist < result.nearestRight.distance) {
          result.nearestRight = { distance: dist, element: sibling };
        }
      }

      // Element above
      if (hOverlap && sibPos.y + sibHeight <= pos.y) {
        const dist = pos.y - (sibPos.y + sibHeight);
        if (!result.nearestTop || dist < result.nearestTop.distance) {
          result.nearestTop = { distance: dist, element: sibling };
        }
      }

      // Element below
      if (hOverlap && sibPos.y >= pos.y + elHeight) {
        const dist = sibPos.y - (pos.y + elHeight);
        if (!result.nearestBottom || dist < result.nearestBottom.distance) {
          result.nearestBottom = { distance: dist, element: sibling };
        }
      }
    }

    return result;
  }, [position, elWidth, elHeight, canvasWidth, canvasHeight, siblingElements, element.id, viewType]);

  // Snap value to grid if enabled
  const snapToGrid = useCallback((value: number): number => {
    if (!snapEnabled) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapEnabled, gridSize]);

  // Handle mouse down - start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    e.preventDefault();
    
    onSelect(element.id);
    
    const rect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    
    const startOffsetX = e.clientX - rect.left - x;
    const startOffsetY = e.clientY - rect.top - y;

    // Add global mouse event listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!elementRef.current?.parentElement) return;
      
      const parentRect = elementRef.current.parentElement.getBoundingClientRect();
      
      // Calculate new position in pixels
      let newX = moveEvent.clientX - parentRect.left - startOffsetX;
      let newY = moveEvent.clientY - parentRect.top - startOffsetY;
      
      // Clamp to canvas bounds
      const maxX = toPixels(state.canvas.dimensions.width) - width;
      const maxY = toPixels(viewType === 'elevation' 
        ? state.canvas.dimensions.height 
        : state.canvas.dimensions.depth) - height;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      // Convert to cm and snap
      const newXCm = snapToGrid(toCm(newX));
      const newYCm = snapToGrid(toCm(newY));
      
      // Update element position (this will change positioning mode to absolute)
      moveElement(element.id, { x: newXCm, y: newYCm });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element.id, onSelect, x, y, moveElement, snapToGrid, toCm, toPixels, width, height, state.canvas.dimensions, viewType]);
  
  // Style based on element type
  const getElementStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      backgroundColor: materialColor,
      border: isSelected ? '2px solid var(--accent-strong)' : '1px solid rgba(255,255,255,0.45)',
      boxSizing: 'border-box',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'border-color 0.2s, transform 0.2s',
      userSelect: 'none',
      zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
      borderRadius: 6,
    };
    
    switch (element.type) {
      case 'niche':
        return {
          ...baseStyle,
          boxShadow: isDragging 
            ? '0 12px 30px rgba(0,0,0,0.35)' 
            : 'inset 0 4px 12px rgba(0,0,0,0.25), 0 8px 25px rgba(0,0,0,0.35)',
        };
      case 'shelf':
        return {
          ...baseStyle,
          borderRadius: '10px',
          boxShadow: isDragging 
            ? '0 12px 28px rgba(0,0,0,0.35)' 
            : '0 4px 12px rgba(0,0,0,0.28)',
        };
      case 'tv-recess':
        return {
          ...baseStyle,
          backgroundColor: '#1f2937',
          border: isSelected ? '2px solid var(--accent-strong)' : '2px solid rgba(255,255,255,0.35)',
          boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.5)' : 'inset 0 2px 10px rgba(0,0,0,0.35)',
        };
      case 'fireplace':
        return {
          ...baseStyle,
          backgroundColor: '#1f2937',
          backgroundImage: 'linear-gradient(to bottom, #374151, #1f2937)',
          boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.5)' : 'inset 0 3px 14px rgba(0,0,0,0.4)',
        };
      default:
        return {
          ...baseStyle,
          boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.35)' : '0 6px 18px rgba(0,0,0,0.25)',
        };
    }
  };
  
  return (
    <div
      ref={elementRef}
      style={getElementStyle()}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          onSelect(element.id);
        }
      }}
      title={`${element.name} (${formatCm(element.dimensions.width)} × ${formatCm(element.dimensions.height)} cm) - Drag to move`}
    >
      {/* Element label */}
      <div className="absolute top-1 left-1 text-xs text-white/80 font-medium truncate max-w-full pr-2 pointer-events-none select-none drop-shadow">
        {element.name}
      </div>
      
      {/* Measurements */}
      {showMeasurements && isSelected && (
        <>
          {/* Width measurement - positioned at bottom-left corner */}
          <div className="absolute pointer-events-none" style={{ bottom: 4, left: 4 }}>
            <span className="bg-cyan-400 text-slate-900 text-xs px-1 rounded shadow">
              W: {formatCm(element.dimensions.width)}
            </span>
          </div>
          
          {/* Height measurement - positioned at bottom-left, below width */}
          <div className="absolute pointer-events-none" style={{ bottom: 20, left: 4 }}>
            <span className="bg-cyan-400 text-slate-900 text-xs px-1 rounded whitespace-nowrap shadow">
              H: {formatCm(viewType === 'elevation' ? element.dimensions.height : element.depth || 0)}
            </span>
          </div>
          
          {/* Position indicator when dragging */}
          {isDragging && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="bg-slate-900/90 text-white text-xs px-1 rounded whitespace-nowrap shadow">
                X: {formatCm(position.x)}, Y: {formatCm(position.y)}
              </span>
            </div>
          )}
        </>
      )}

      {/* Distance indicators - shown when selected OR when showAllDistances is enabled */}
      {(isSelected || showAllDistances) && showMeasurements && (
        <>
          {/* Distance to left - top-left area */}
          {(distances.left > 0 || distances.nearestLeft) && (
            <div 
              className="absolute pointer-events-none"
              style={{ top: 4, left: 4 }}
            >
              <span className="bg-amber-400 text-slate-900 text-xs px-1 rounded whitespace-nowrap shadow">
                ← {formatCm(distances.nearestLeft?.distance ?? distances.left)}
              </span>
            </div>
          )}

          {/* Distance to right - top-right area */}
          {(distances.right > 0 || distances.nearestRight) && (
            <div 
              className="absolute pointer-events-none"
              style={{ top: 4, right: 4 }}
            >
              <span className="bg-amber-400 text-slate-900 text-xs px-1 rounded whitespace-nowrap shadow">
                {formatCm(distances.nearestRight?.distance ?? distances.right)} →
              </span>
            </div>
          )}

          {/* Distance to top - below element name on left */}
          {(distances.top > 0 || distances.nearestTop) && (
            <div 
              className="absolute pointer-events-none"
              style={{ top: 20, left: 4 }}
            >
              <span className="bg-amber-400 text-slate-900 text-xs px-1 rounded whitespace-nowrap shadow">
                ↑ {formatCm(distances.nearestTop?.distance ?? distances.top)}
              </span>
            </div>
          )}

          {/* Distance to bottom - bottom-right corner */}
          {(distances.bottom > 0 || distances.nearestBottom) && (
            <div 
              className="absolute pointer-events-none"
              style={{ bottom: 4, right: 4 }}
            >
              <span className="bg-amber-400 text-slate-900 text-xs px-1 rounded whitespace-nowrap shadow">
                ↓ {formatCm(distances.nearestBottom?.distance ?? distances.bottom)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
