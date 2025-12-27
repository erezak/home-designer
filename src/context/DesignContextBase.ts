import { createContext, type Dispatch } from 'react';
import { type DesignState, type DesignElement, type CanvasConfig, type ViewType, type ElementType, type Position } from '../types';

export type DesignAction =
  | { type: 'SET_CANVAS'; payload: Partial<CanvasConfig> }
  | { type: 'ADD_ELEMENT'; payload: { element: Omit<DesignElement, 'id' | 'computedPosition'>; parentId?: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<DesignElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'REORDER_ELEMENTS'; payload: DesignElement[] }
  | { type: 'LOAD_STATE'; payload: DesignState };

export interface DesignContextType {
  state: DesignState;
  dispatch: Dispatch<DesignAction>;
  // Helper functions
  setCanvas: (config: Partial<CanvasConfig>) => void;
  addElement: (type: ElementType, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setView: (view: ViewType) => void;
  setZoom: (zoom: number) => void;
  moveElement: (id: string, position: Position) => void;
  getSelectedElement: () => DesignElement | null;
  findElementById: (id: string) => DesignElement | null;
  exportState: () => string;
  importState: (json: string) => void;
}

export const DesignContext = createContext<DesignContextType | null>(null);
