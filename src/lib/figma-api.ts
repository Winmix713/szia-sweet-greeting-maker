interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, FigmaComponent>;
  styles: Record<string, FigmaStyle>;
  name: string;
  lastModified: string;
  version: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  effects?: FigmaEffect[];
  constraints?: FigmaConstraints;
  absoluteBoundingBox?: FigmaBoundingBox;
  styles?: Record<string, string>;
}

interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
  documentationLinks: Array<{ uri: string }>;
}

interface FigmaStyle {
  key: string;
  name: string;
  description: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
}

interface FigmaFill {
  blendMode: string;
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE';
  color?: { r: number; g: number; b: number; a: number };
  gradientStops?: Array<{ color: { r: number; g: number; b: number; a: number }; position: number }>;
}

interface FigmaStroke {
  blendMode: string;
  type: string;
  color: { r: number; g: number; b: number; a: number };
}

interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible: boolean;
  radius: number;
  color?: { r: number; g: number; b: number; a: number };
  offset?: { x: number; y: number };
}

interface FigmaConstraints {
  vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class FigmaAPI {
  private baseUrl = 'https://api.figma.com/v1';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Figma-Token': this.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    return this.request<FigmaFileResponse>(`/files/${fileKey}`);
  }

  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    const idsParam = nodeIds.join(',');
    return this.request(`/files/${fileKey}/nodes?ids=${idsParam}`);
  }

  async getImages(fileKey: string, nodeIds: string[], format: 'jpg' | 'png' | 'svg' = 'svg', scale: number = 1): Promise<any> {
    const idsParam = nodeIds.join(',');
    return this.request(`/images/${fileKey}?ids=${idsParam}&format=${format}&scale=${scale}`);
  }

  extractFileKey(figmaUrl: string): string | null {
    const match = figmaUrl.match(/\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  convertFigmaColorToHex(color: { r: number; g: number; b: number; a?: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  convertFigmaColorToRgba(color: { r: number; g: number; b: number; a?: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = color.a !== undefined ? color.a : 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  extractDesignTokens(figmaFile: FigmaFileResponse): any {
    const tokens = {
      colors: {} as Record<string, string>,
      typography: {} as Record<string, any>,
      spacing: {} as Record<string, string>,
      effects: {} as Record<string, any>,
    };

    // Extract colors from styles
    Object.entries(figmaFile.styles).forEach(([key, style]) => {
      if (style.styleType === 'FILL') {
        tokens.colors[style.name] = key;
      } else if (style.styleType === 'TEXT') {
        tokens.typography[style.name] = key;
      } else if (style.styleType === 'EFFECT') {
        tokens.effects[style.name] = key;
      }
    });

    // Recursively extract tokens from nodes
    const extractFromNode = (node: FigmaNode) => {
      // Extract colors from fills
      if (node.fills) {
        node.fills.forEach((fill, index) => {
          if (fill.type === 'SOLID' && fill.color) {
            const colorName = `${node.name}-fill-${index}`;
            tokens.colors[colorName] = this.convertFigmaColorToHex(fill.color);
          }
        });
      }

      // Extract spacing from bounding box
      if (node.absoluteBoundingBox) {
        const { width, height } = node.absoluteBoundingBox;
        tokens.spacing[`${node.name}-width`] = `${width}px`;
        tokens.spacing[`${node.name}-height`] = `${height}px`;
      }

      // Recursively process children
      if (node.children) {
        node.children.forEach(extractFromNode);
      }
    };

    extractFromNode(figmaFile.document);

    return tokens;
  }

  convertToComponents(figmaFile: FigmaFileResponse): any[] {
    const components: any[] = [];

    const processNode = (node: FigmaNode, depth = 0) => {
      // Only process component nodes or frames that might be components
      if (node.type === 'COMPONENT' || node.type === 'FRAME') {
        const styles: Record<string, string> = {};

        // Extract styles from fills
        if (node.fills && node.fills.length > 0) {
          const fill = node.fills[0];
          if (fill.type === 'SOLID' && fill.color) {
            styles.backgroundColor = this.convertFigmaColorToHex(fill.color);
          }
        }

        // Extract styles from strokes
        if (node.strokes && node.strokes.length > 0) {
          const stroke = node.strokes[0];
          if (stroke.color) {
            styles.borderColor = this.convertFigmaColorToHex(stroke.color);
          }
        }

        // Extract dimensions
        if (node.absoluteBoundingBox) {
          styles.width = `${node.absoluteBoundingBox.width}px`;
          styles.height = `${node.absoluteBoundingBox.height}px`;
        }

        components.push({
          id: node.id,
          name: node.name,
          type: node.type,
          styles,
          children: node.children ? node.children.map(child => ({
            id: child.id,
            name: child.name,
            type: child.type
          })) : []
        });
      }

      // Recursively process children
      if (node.children) {
        node.children.forEach(child => processNode(child, depth + 1));
      }
    };

    processNode(figmaFile.document);

    return components;
  }
}