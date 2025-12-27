// Units are always stored in centimeters with 2 decimal precision
export type Centimeters = number;

// Material types for elements
export type MaterialType = 
  | 'drywall'
  | 'wood'
  | 'glass'
  | 'metal'
  | 'stone'
  | 'mdf';

// Element types that can be placed on the canvas
export type ElementType = 
  | 'wall'      // Main structure
  | 'niche'     // Recessed box
  | 'shelf'     // Horizontal shelf
  | 'tv-recess' // TV mounting area
  | 'fireplace' // Fireplace opening
  | 'custom';   // Custom shape

// Positioning mode for elements
export type PositionMode = 
  | 'auto'      // Auto-stack top-to-bottom, left-to-right
  | 'relative'  // Position relative to another element
  | 'absolute'; // Precise X/Y coordinates

// Relative position anchor
export type RelativeAnchor = 
  | 'next-to'   // Horizontally adjacent
  | 'below'     // Vertically below
  | 'above'     // Vertically above
  | 'inside';   // Nested inside

// Base dimensions
export interface Dimensions {
  width: Centimeters;
  height: Centimeters;
}

// Full 3D dimensions (for elements with depth)
export interface Dimensions3D extends Dimensions {
  depth: Centimeters;
}

// Position on canvas
export interface Position {
  x: Centimeters;
  y: Centimeters;
}

// Element positioning configuration
export interface Positioning {
  mode: PositionMode;
  // For absolute positioning
  position?: Position;
  // For relative positioning
  relativeTo?: string; // Element ID
  anchor?: RelativeAnchor;
  offset?: Position; // Offset from calculated position
}

// Material configuration
export interface Material {
  type: MaterialType;
  color?: string; // Custom color override
  label?: string; // Display label
}

// Base design element
export interface DesignElement {
  id: string;
  type: ElementType;
  name: string;
  dimensions: Dimensions;
  depth?: Centimeters; // Only for niches and some elements
  positioning: Positioning;
  material: Material;
  children: DesignElement[]; // Nested elements
  parentId?: string; // Reference to parent element
  // Computed values (calculated at render time)
  computedPosition?: Position;
  // Z-order index (higher values render on top)
  zIndex?: number;
}

// Canvas/Structure configuration
export interface CanvasConfig {
  id: string;
  name: string;
  dimensions: Dimensions3D; // Width, height, and thickness/depth
  material: Material;
  scale: number; // e.g., 20 for 1:20 scale
  showGrid: boolean;
  gridSize: Centimeters; // Size of grid cells in cm
  snapToGrid: boolean;
  snapToElements: boolean;
  autoPosition: boolean; // Auto-stack elements
  showAllDistances: boolean; // Show distance markers for all elements
}

// View type
export type ViewType = 'elevation' | 'plan';

// Application state
export interface DesignState {
  canvas: CanvasConfig;
  elements: DesignElement[];
  selectedElementId: string | null;
  activeView: ViewType;
  zoom: number; // Viewport zoom level (1 = 100%)
  // Sidebar visibility state (collapsible)
  sidebars: {
    leftCollapsed: boolean;
    rightCollapsed: boolean;
  };
}

// Material color mapping
export const MATERIAL_COLORS: Record<MaterialType, string> = {
  drywall: '#e5e5e5',
  wood: '#a0714a',
  glass: 'rgba(200, 230, 255, 0.6)',
  metal: '#71717a',
  stone: '#9ca3af',
  mdf: '#d4b896',
};

// Element type display names
export const ELEMENT_TYPE_NAMES: Record<ElementType, string> = {
  wall: 'Wall Structure',
  niche: 'Niche',
  shelf: 'Shelf',
  'tv-recess': 'TV Recess',
  fireplace: 'Fireplace',
  custom: 'Custom Shape',
};

// Default dimensions for element types (in cm)
export const DEFAULT_DIMENSIONS: Record<ElementType, Dimensions> = {
  wall: { width: 300, height: 250 },
  niche: { width: 40, height: 40 },
  shelf: { width: 50, height: 3 },
  'tv-recess': { width: 120, height: 70 },
  fireplace: { width: 100, height: 40 },
  custom: { width: 50, height: 50 },
};

// Format a number to 2 decimal places
export function formatCm(value: Centimeters): string {
  return value.toFixed(2);
}

// Parse a string to centimeters
export function parseCm(value: string): Centimeters {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
}
