
export interface FigmaConverterProps {
  className?: string;
}

export interface FigmaExportOptions {
  format: 'react' | 'vue' | 'html';
  includeStyles: boolean;
  componentName?: string;
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
}
