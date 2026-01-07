import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'he';

export interface Translations {
  // Toolbar
  toolbar: {
    appSubtitle: string;
    view: string;
    elevation: string;
    plan: string;
    zoom: string;
    reset: string;
  };
  
  // Navigation
  nav: {
    canvas: string;
    elements: string;
    export: string;
  };
  
  // Canvas Settings
  canvasSettings: {
    title: string;
    designName: string;
    designNamePlaceholder: string;
    dimensions: string;
    width: string;
    height: string;
    depth: string;
    material: string;
    scale: string;
    gridOptions: string;
    showGrid: string;
    gridSize: string;
    snapToGrid: string;
    snapToElements: string;
    autoPosition: string;
    showAllDistances: string;
  };
  
  // Element Panel
  elementPanel: {
    title: string;
    addElement: string;
    willBeAddedInside: string;
    elementsCount: string;
    noElements: string;
    clickButtonsAbove: string;
    editElement: string;
    delete: string;
    name: string;
    namePlaceholder: string;
    type: string;
    positionMode: string;
    relativeTo: string;
    selectElement: string;
    anchor: string;
    nextTo: string;
    below: string;
    above: string;
    inside: string;
    offsetX: string;
    offsetY: string;
    x: string;
    y: string;
    auto: string;
    relative: string;
    absolute: string;
  };
  
  // Element Types
  elementTypes: {
    wall: string;
    niche: string;
    shelf: string;
    tvRecess: string;
    fireplace: string;
    custom: string;
  };
  
  // Materials
  materials: {
    drywall: string;
    wood: string;
    glass: string;
    metal: string;
    stone: string;
    mdf: string;
  };
  
  // Export Panel
  exportPanel: {
    title: string;
    exportPdf: string;
    exportPng: string;
    print: string;
    projectFormat: string;
    saveProject: string;
    loadProject: string;
    autoSaved: string;
  };
  
  // Area Summary
  areaSummary: {
    title: string;
    totalWallArea: string;
    niches: string;
    netArea: string;
    nichesCoverage: string;
    ofWall: string;
  };
  
  // Common
  common: {
    cm: string;
    cmUnit: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    toolbar: {
      appSubtitle: 'Home Designer Pro',
      view: 'View:',
      elevation: 'Elevation',
      plan: 'Plan',
      zoom: 'Zoom:',
      reset: 'Reset',
    },
    nav: {
      canvas: 'Canvas',
      elements: 'Elements',
      export: 'Export',
    },
    canvasSettings: {
      title: 'Canvas Settings',
      designName: 'Design Name',
      designNamePlaceholder: 'Enter design name',
      dimensions: 'Dimensions',
      width: 'Width (cm)',
      height: 'Height (cm)',
      depth: 'Depth (cm)',
      material: 'Material',
      scale: 'Scale (1:X)',
      gridOptions: 'Grid Options',
      showGrid: 'Show Grid',
      gridSize: 'Grid Size (cm)',
      snapToGrid: 'Snap to Grid',
      snapToElements: 'Snap to Elements',
      autoPosition: 'Auto-position Elements',
      showAllDistances: 'Show All Distances',
    },
    elementPanel: {
      title: 'Elements',
      addElement: 'Add Element',
      willBeAddedInside: 'Will be added inside:',
      elementsCount: 'Elements',
      noElements: 'No elements yet',
      clickButtonsAbove: 'Click the buttons above to add elements',
      editElement: 'Edit Element',
      delete: 'Delete',
      name: 'Name',
      namePlaceholder: 'Element name',
      type: 'Type',
      positionMode: 'Position Mode',
      relativeTo: 'Relative To',
      selectElement: 'Select element...',
      anchor: 'Anchor',
      nextTo: 'Next To (Right)',
      below: 'Below',
      above: 'Above',
      inside: 'Inside',
      offsetX: 'Offset X (cm)',
      offsetY: 'Offset Y (cm)',
      x: 'X (cm)',
      y: 'Y (cm)',
      auto: 'Auto',
      relative: 'Relative',
      absolute: 'Absolute',
    },
    elementTypes: {
      wall: 'Wall Structure',
      niche: 'Niche',
      shelf: 'Shelf',
      tvRecess: 'TV Recess',
      fireplace: 'Fireplace',
      custom: 'Custom Shape',
    },
    materials: {
      drywall: 'Drywall',
      wood: 'Wood',
      glass: 'Glass',
      metal: 'Metal',
      stone: 'Stone',
      mdf: 'MDF',
    },
    exportPanel: {
      title: 'Export & Save',
      exportPdf: 'Export PDF',
      exportPng: 'Export PNG',
      print: 'Print',
      projectFormat: 'Project Format',
      saveProject: 'Save Project',
      loadProject: 'Load Project',
      autoSaved: 'Auto-saved to browser',
    },
    areaSummary: {
      title: 'Area Summary',
      totalWallArea: 'Total Wall Area',
      niches: 'Niches',
      netArea: 'Net Area',
      nichesCoverage: 'Niches coverage:',
      ofWall: 'of wall',
    },
    common: {
      cm: 'cm',
      cmUnit: 'cm',
    },
  },
  he: {
    toolbar: {
      appSubtitle: 'מעצב בית מקצועי',
      view: 'תצוגה:',
      elevation: 'חזית',
      plan: 'תוכנית',
      zoom: 'זום:',
      reset: 'אפס',
    },
    nav: {
      canvas: 'לוח',
      elements: 'רכיבים',
      export: 'ייצוא',
    },
    canvasSettings: {
      title: 'הגדרות לוח',
      designName: 'שם העיצוב',
      designNamePlaceholder: 'הזן שם עיצוב',
      dimensions: 'מידות',
      width: 'רוחב (ס״מ)',
      height: 'גובה (ס״מ)',
      depth: 'עומק (ס״מ)',
      material: 'חומר',
      scale: 'קנה מידה (1:X)',
      gridOptions: 'אפשרויות רשת',
      showGrid: 'הצג רשת',
      gridSize: 'גודל רשת (ס״מ)',
      snapToGrid: 'הצמד לרשת',
      snapToElements: 'הצמד לרכיבים',
      autoPosition: 'מיקום אוטומטי לרכיבים',
      showAllDistances: 'הצג את כל המרחקים',
    },
    elementPanel: {
      title: 'רכיבים',
      addElement: 'הוסף רכיב',
      willBeAddedInside: 'יתווסף בתוך:',
      elementsCount: 'רכיבים',
      noElements: 'אין רכיבים עדיין',
      clickButtonsAbove: 'לחץ על הכפתורים למעלה להוספת רכיבים',
      editElement: 'ערוך רכיב',
      delete: 'מחק',
      name: 'שם',
      namePlaceholder: 'שם הרכיב',
      type: 'סוג',
      positionMode: 'מצב מיקום',
      relativeTo: 'יחסית ל',
      selectElement: 'בחר רכיב...',
      anchor: 'עיגון',
      nextTo: 'לצד (ימין)',
      below: 'מתחת',
      above: 'מעל',
      inside: 'בתוך',
      offsetX: 'היסט X (ס״מ)',
      offsetY: 'היסט Y (ס״מ)',
      x: 'X (ס״מ)',
      y: 'Y (ס״מ)',
      auto: 'אוטומטי',
      relative: 'יחסי',
      absolute: 'מוחלט',
    },
    elementTypes: {
      wall: 'מבנה קיר',
      niche: 'נישה',
      shelf: 'מדף',
      tvRecess: 'שקע טלוויזיה',
      fireplace: 'אח',
      custom: 'צורה מותאמת אישית',
    },
    materials: {
      drywall: 'גבס',
      wood: 'עץ',
      glass: 'זכוכית',
      metal: 'מתכת',
      stone: 'אבן',
      mdf: 'MDF',
    },
    exportPanel: {
      title: 'ייצוא ושמירה',
      exportPdf: 'ייצא PDF',
      exportPng: 'ייצא PNG',
      print: 'הדפס',
      projectFormat: 'פורמט פרויקט',
      saveProject: 'שמור פרויקט',
      loadProject: 'טען פרויקט',
      autoSaved: 'נשמר אוטומטית בדפדפן',
    },
    areaSummary: {
      title: 'סיכום שטחים',
      totalWallArea: 'סך שטח קיר',
      niches: 'נישות',
      netArea: 'שטח נקי',
      nichesCoverage: 'כיסוי נישות:',
      ofWall: 'מהקיר',
    },
    common: {
      cm: 'ס״מ',
      cmUnit: 'ס״מ',
    },
  },
};

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('home_designer_language');
      return (saved === 'he' ? 'he' : 'en') as Language;
    } catch {
      // Fallback to English if localStorage is unavailable
      return 'en';
    }
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('home_designer_language', lang);
    } catch {
      // Silently fail if localStorage is unavailable
      console.warn('Failed to save language preference to localStorage');
    }
  };

  // Set document direction when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
