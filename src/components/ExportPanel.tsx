import { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import yaml from 'js-yaml';
import { useDesign } from '../context/DesignContext';
import { useTranslation } from '../context/TranslationContext';
import { formatCm } from '../types';

type ExportFormat = 'json' | 'yaml';

interface ExportPanelProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ canvasRef }: ExportPanelProps) {
  const { state, exportState, importState } = useDesign();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');

  const generatePDF = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      pdf.setFontSize(16);
      pdf.text(state.canvas.name, 14, 15);

      // Add scale info
      pdf.setFontSize(10);
      pdf.text(`Scale: 1:${state.canvas.scale}`, 14, 22);
      pdf.text(
        `Canvas: ${formatCm(state.canvas.dimensions.width)} × ${formatCm(
          state.canvas.dimensions.height
        )} × ${formatCm(state.canvas.dimensions.depth)} cm`,
        14,
        28
      );

      // Add view type
      pdf.text(
        `View: ${state.activeView === 'elevation' ? 'Front Elevation' : 'Top-Down Plan'}`,
        14,
        34
      );

      // Calculate image dimensions to fit on page
      const imgWidth = pageWidth - 28;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const yOffset = 42;

      // Check if image fits on page
      if (imgHeight + yOffset > pageHeight - 20) {
        const scaledHeight = pageHeight - yOffset - 20;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', 14, yOffset, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 14, yOffset, imgWidth, imgHeight);
      }

      // Add measurements table
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text('Element Measurements', 14, 15);

      pdf.setFontSize(10);
      let yPos = 25;

      // Table header
      pdf.setFont('helvetica', 'bold');
      pdf.text('Element', 14, yPos);
      pdf.text('Type', 70, yPos);
      pdf.text('Width (cm)', 100, yPos);
      pdf.text('Height (cm)', 130, yPos);
      pdf.text('Depth (cm)', 160, yPos);
      pdf.text('Material', 190, yPos);

      yPos += 2;
      pdf.line(14, yPos, pageWidth - 14, yPos);
      yPos += 6;

      pdf.setFont('helvetica', 'normal');

      // Add elements
      const addElementsToPDF = (elements: typeof state.elements, indent = 0) => {
        elements.forEach((el) => {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = 20;
          }

          const prefix = '  '.repeat(indent);
          pdf.text(prefix + el.name, 14, yPos);
          pdf.text(el.type, 70, yPos);
          pdf.text(formatCm(el.dimensions.width), 100, yPos);
          pdf.text(formatCm(el.dimensions.height), 130, yPos);
          pdf.text(formatCm(el.depth || 0), 160, yPos);
          pdf.text(el.material.type, 190, yPos);

          yPos += 6;

          if (el.children.length > 0) {
            addElementsToPDF(el.children, indent + 1);
          }
        });
      };

      addElementsToPDF(state.elements);

      // Add footer with date
      pdf.setFontSize(8);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()} | Home Designer`,
        14,
        pageHeight - 10
      );

      pdf.save(`${state.canvas.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [canvasRef, state]);

  const exportPNG = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3, // Higher quality for PNG
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${state.canvas.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export PNG. Please try again.');
    }
  }, [canvasRef, state.canvas.name]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSaveProject = useCallback(() => {
    const jsonData = exportState();
    let content: string;
    let mimeType: string;
    let extension: string;

    if (exportFormat === 'yaml') {
      const parsed = JSON.parse(jsonData);
      content = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
      mimeType = 'text/yaml';
      extension = 'yaml';
    } else {
      content = jsonData;
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${state.canvas.name.replace(/\s+/g, '_')}.${extension}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportState, state.canvas.name, exportFormat]);

  const handleLoadProject = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        try {
          let jsonString: string;
          
          // Check if it's YAML or JSON based on file extension or content
          if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
            const parsed = yaml.load(content);
            jsonString = JSON.stringify(parsed);
          } else {
            // Try to parse as JSON first, if that fails try YAML
            try {
              JSON.parse(content);
              jsonString = content;
            } catch {
              const parsed = yaml.load(content);
              jsonString = JSON.stringify(parsed);
            }
          }
          
          importState(jsonString);
        } catch (error) {
          console.error('Failed to parse file:', error);
          alert('Failed to load project. Please check the file format.');
        }
      };
      reader.readAsText(file);

      // Reset input
      event.target.value = '';
    },
    [importState]
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="panel-header">{t.exportPanel.title}</h3>
      </div>

      <div className="space-y-3">
        <button onClick={generatePDF} className="btn-primary w-full">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {t.exportPanel.exportPdf}
          </span>
        </button>

        <button onClick={exportPNG} className="btn-accent w-full">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t.exportPanel.exportPng}
          </span>
        </button>

        <button onClick={handlePrint} className="btn-secondary w-full">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {t.exportPanel.print}
          </span>
        </button>
      </div>

      <div 
        className="h-px"
        style={{ backgroundColor: 'var(--color-border)' }}
      />

      <div className="panel space-y-4">
        <div>
          <label 
            className="block text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.exportPanel.projectFormat}
          </label>
          <select
            className="input-field"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
        </div>

        <button onClick={handleSaveProject} className="btn-primary w-full">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {t.exportPanel.saveProject} ({exportFormat.toUpperCase()})
          </span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            {t.exportPanel.loadProject}
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.yaml,.yml"
          onChange={handleLoadProject}
          className="hidden"
        />

        <div 
          className="pt-3 text-center border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p 
            className="text-xs font-semibold flex items-center justify-center gap-2"
            style={{ color: 'var(--color-success)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.exportPanel.autoSaved}
          </p>
        </div>
      </div>
    </div>
  );
}
