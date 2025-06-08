
export interface FigmaConverterProps {
  className?: string;
  onSvgExtracted?: (svg: string, metadata: any) => void;
}

export interface FigmaExportOptions {
  format: 'react' | 'vue' | 'html';
  includeStyles: boolean;
  componentName?: string;
  extractDesignTokens: boolean;
  generateVariants: boolean;
  includeResponsive: boolean;
  optimizeForProduction: boolean;
  extractColors: boolean;
  extractTypography: boolean;
  generateStorybook: boolean;
}

export interface FigmaDesignData {
  id: string;
  name: string;
  components: FigmaComponent[];
  designTokens: DesignTokens;
  metadata: FigmaMetadata;
}

export interface FigmaComponent {
  id: string;
  name: string;
  type: string;
  styles: Record<string, string>;
  children?: FigmaComponent[];
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
}

export interface FigmaMetadata {
  version: string;
  lastModified: string;
  author: string;
}

export interface ProcessedComponent {
  name: string;
  code: string;
  props: string;
  styles: string;
  originalCss: string;
  reactCode: string;
  styledCss: string;
  htmlStructure: string;
  tailwindClasses: {
    main: string;
    customStyles: string[];
  };
  stats: {
    cssRules: number;
    responsiveBreakpoints: number;
    animations: number;
    customProperties: number;
  };
}
