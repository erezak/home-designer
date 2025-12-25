# Home Designer

A modern web application for creating wall design layouts with precise measurements. Design entertainment centers, wall units with niches, shelves, TV recesses, fireplaces, and more.

![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)

## Features

### 🎨 Design Canvas
- **Front Elevation View** - Design your wall from the front perspective
- **Top-Down Plan View** - See depth and layout from above
- **Configurable Canvas** - Set custom width, height, and depth dimensions
- **Grid Overlay** - Optional grid with configurable size for alignment
- **Snap-to-Grid** - Precise element placement with grid snapping
- **Zoom Controls** - Zoom in/out for detailed work or overview

### 📐 Element Types
- **Niche** - Recessed areas in the wall
- **Shelf** - Horizontal shelving units
- **TV Recess** - Dedicated space for television mounting
- **Fireplace** - Fireplace installations
- **Custom** - Any other design element

### 🔧 Element Management
- **Drag & Drop** - Reposition elements by dragging
- **Precise Measurements** - Enter exact dimensions in centimeters
- **Material Selection** - Choose from wood, MDF, drywall, glass, metal, or custom colors
- **Auto-Positioning** - Automatic top-to-bottom, left-to-right placement
- **Absolute Positioning** - Manual X/Y coordinate placement
- **Nested Elements** - Add child elements inside parent elements
- **Distance Indicators** - Visual guides showing gaps between elements

### 💾 Save & Export
- **JSON Export/Import** - Save and load projects in JSON format
- **YAML Export/Import** - Alternative YAML format support
- **PDF Export** - Generate PDF with measurements table
- **PNG Export** - Export canvas as image
- **Print Support** - Direct printing from the browser
- **Auto-Save** - Automatic saving to browser localStorage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/home_designer.git
   cd home_designer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Usage

### Creating a Design

1. **Configure Canvas** - Set your wall dimensions (width, height, depth) in the Canvas Settings panel
2. **Add Elements** - Use the Element Panel to add niches, shelves, or other elements
3. **Position Elements** - Drag elements to reposition, or enter exact coordinates
4. **Set Dimensions** - Enter precise measurements for each element
5. **Choose Materials** - Select materials and colors for visual representation

### Keyboard Shortcuts

- Click an element to select it
- Drag selected elements to reposition
- Click empty canvas area to deselect

### Exporting Your Design

1. Click the **Export** button in the toolbar
2. Choose your format:
   - **PDF** - Includes visual design and measurements table
   - **PNG** - Image export of the canvas
   - **JSON/YAML** - Project file for later editing
3. Use **Print** for direct printing

## Tech Stack

- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[React](https://react.dev/)** - UI component library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[html2canvas](https://html2canvas.hertzen.com/)** - Canvas screenshot capture
- **[js-yaml](https://github.com/nodeca/js-yaml)** - YAML parsing and serialization

## Project Structure

```
home_designer/
├── src/
│   ├── components/
│   │   ├── CanvasSettings.tsx   # Canvas configuration form
│   │   ├── DesignCanvas.tsx     # Main design canvas
│   │   ├── ElementPanel.tsx     # Element list and editor
│   │   ├── ElementRenderer.tsx  # Individual element rendering
│   │   ├── ExportPanel.tsx      # Export/import functionality
│   │   └── Toolbar.tsx          # View and zoom controls
│   ├── context/
│   │   └── DesignContext.tsx    # Global state management
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by professional interior design software
- Built with modern web technologies for optimal performance
