import { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import yaml from 'js-yaml';
import { useDesign } from '../context/DesignContext';
import { formatCm } from '../types';

type ExportFormat = 'json' | 'yaml';

interface ExportPanelProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ canvasRef }: ExportPanelProps) {
  const { state, exportState, importState } = useDesign();
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
        <h3 
          className="text-base font-medium mb-4" 
          style={{ 
            color: 'var(--color-text)', 
            letterSpacing: '-0.022em',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          Export
        </h3>

        <div className="space-y-2.5">
          <button onClick={generatePDF} className="btn-primary w-full text-sm">
            Export PDF
          </button>

          <button onClick={exportPNG} className="btn-secondary w-full text-sm">
            Export PNG
          </button>

          <button onClick={handlePrint} className="btn-secondary w-full text-sm">
            Print
          </button>
        </div>

        <div 
          className="my-4" 
          style={{ height: '1px', backgroundColor: 'var(--color-border)' }}
        />

        <div className="space-y-2.5">
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
            >
              Format
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

          <button onClick={handleSaveProject} className="btn-secondary w-full text-sm">
            Save Project
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary w-full text-sm"
          >
            Load Project
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml"
            onChange={handleLoadProject}
            className="hidden"
          />

          <p 
            className="text-xs text-center pt-1" 
            style={{ color: 'var(--color-text-muted)' }}
          >
            Auto-saved to browser
          </p>
        </div>
      </div>
    </div>
  );
}
