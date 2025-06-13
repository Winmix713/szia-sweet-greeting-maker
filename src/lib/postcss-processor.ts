import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

export interface CSSProcessingOptions {
  autoprefixer?: boolean;
  minify?: boolean;
  preserveComments?: boolean;
  extractVariables?: boolean;
}

export interface ProcessedCSS {
  css: string;
  variables: Record<string, string>;
  mediaQueries: string[];
  animations: string[];
  errors: string[];
}

export class PostCSSProcessor {
  private processor: postcss.Processor;

  constructor(options: CSSProcessingOptions = {}) {
    const plugins: postcss.Plugin[] = [];

    if (options.autoprefixer !== false) {
      plugins.push(autoprefixer());
    }

    this.processor = postcss(plugins);
  }

  async process(css: string, options: CSSProcessingOptions = {}): Promise<ProcessedCSS> {
    const result: ProcessedCSS = {
      css: '',
      variables: {},
      mediaQueries: [],
      animations: [],
      errors: []
    };

    try {
      const processed = await this.processor.process(css, { from: undefined });
      result.css = processed.css;

      // Extract CSS custom properties (variables)
      if (options.extractVariables) {
        result.variables = this.extractCSSVariables(css);
      }

      // Extract media queries
      result.mediaQueries = this.extractMediaQueries(css);

      // Extract animations
      result.animations = this.extractAnimations(css);

      // Handle warnings as non-fatal errors
      processed.warnings().forEach(warn => {
        result.errors.push(warn.toString());
      });

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown processing error');
      result.css = css; // Return original CSS if processing fails
    }

    return result;
  }

  private extractCSSVariables(css: string): Record<string, string> {
    const variables: Record<string, string> = {};
    const variableRegex = /--([a-zA-Z-]+):\s*([^;]+);/g;
    let match;

    while ((match = variableRegex.exec(css)) !== null) {
      variables[match[1]] = match[2].trim();
    }

    return variables;
  }

  private extractMediaQueries(css: string): string[] {
    const mediaQueries: string[] = [];
    const mediaRegex = /@media\s*([^{]+)/g;
    let match;

    while ((match = mediaRegex.exec(css)) !== null) {
      mediaQueries.push(match[1].trim());
    }

    return mediaQueries;
  }

  private extractAnimations(css: string): string[] {
    const animations: string[] = [];
    const animationRegex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
    let match;

    while ((match = animationRegex.exec(css)) !== null) {
      animations.push(match[1]);
    }

    return animations;
  }

  convertToTailwind(css: string): { tailwindClasses: string[]; remainingCSS: string } {
    const tailwindClasses: string[] = [];
    let remainingCSS = css;

    // CSS to Tailwind mappings
    const mappings = [
      // Display
      { pattern: /display:\s*flex/g, tailwind: 'flex' },
      { pattern: /display:\s*block/g, tailwind: 'block' },
      { pattern: /display:\s*inline/g, tailwind: 'inline' },
      { pattern: /display:\s*inline-block/g, tailwind: 'inline-block' },
      { pattern: /display:\s*grid/g, tailwind: 'grid' },
      { pattern: /display:\s*none/g, tailwind: 'hidden' },

      // Flexbox
      { pattern: /flex-direction:\s*column/g, tailwind: 'flex-col' },
      { pattern: /flex-direction:\s*row/g, tailwind: 'flex-row' },
      { pattern: /justify-content:\s*center/g, tailwind: 'justify-center' },
      { pattern: /justify-content:\s*space-between/g, tailwind: 'justify-between' },
      { pattern: /justify-content:\s*flex-start/g, tailwind: 'justify-start' },
      { pattern: /justify-content:\s*flex-end/g, tailwind: 'justify-end' },
      { pattern: /align-items:\s*center/g, tailwind: 'items-center' },
      { pattern: /align-items:\s*flex-start/g, tailwind: 'items-start' },
      { pattern: /align-items:\s*flex-end/g, tailwind: 'items-end' },

      // Spacing
      { pattern: /padding:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => this.pxToTailwind('p', match[1]) },
      { pattern: /margin:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => this.pxToTailwind('m', match[1]) },
      { pattern: /gap:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => this.pxToTailwind('gap', match[1]) },

      // Colors
      { pattern: /color:\s*#([0-9a-fA-F]{6})/g, tailwind: (match: RegExpExecArray) => `text-[#${match[1]}]` },
      { pattern: /background-color:\s*#([0-9a-fA-F]{6})/g, tailwind: (match: RegExpExecArray) => `bg-[#${match[1]}]` },

      // Border
      { pattern: /border-radius:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => this.pxToTailwind('rounded', match[1]) },
      { pattern: /border:\s*(\d+)px\s+solid\s+#([0-9a-fA-F]{6})/g, tailwind: (match: RegExpExecArray) => `border border-[#${match[2]}]` },

      // Typography
      { pattern: /font-size:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => this.pxToFontSize(match[1]) },
      { pattern: /font-weight:\s*(\d+)/g, tailwind: (match: RegExpExecArray) => this.fontWeightToTailwind(match[1]) },
      { pattern: /text-align:\s*center/g, tailwind: 'text-center' },
      { pattern: /text-align:\s*left/g, tailwind: 'text-left' },
      { pattern: /text-align:\s*right/g, tailwind: 'text-right' },

      // Sizing
      { pattern: /width:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => `w-[${match[1]}px]` },
      { pattern: /height:\s*(\d+)px/g, tailwind: (match: RegExpExecArray) => `h-[${match[1]}px]` },
      { pattern: /width:\s*100%/g, tailwind: 'w-full' },
      { pattern: /height:\s*100%/g, tailwind: 'h-full' },
    ];

    mappings.forEach(mapping => {
      let match;
      while ((match = mapping.pattern.exec(css)) !== null) {
        if (typeof mapping.tailwind === 'function') {
          tailwindClasses.push(mapping.tailwind(match));
        } else {
          tailwindClasses.push(mapping.tailwind);
        }
        
        // Remove the matched CSS property from remaining CSS
        remainingCSS = remainingCSS.replace(match[0], '');
      }
    });

    // Clean up remaining CSS
    remainingCSS = remainingCSS
      .replace(/\s*;\s*/g, '; ')
      .replace(/\s*{\s*/g, ' { ')
      .replace(/\s*}\s*/g, ' } ')
      .trim();

    // Remove duplicates by converting to Set and back to array
    const uniqueClasses = tailwindClasses.filter((value, index, self) => self.indexOf(value) === index);
    
    return {
      tailwindClasses: uniqueClasses,
      remainingCSS: remainingCSS
    };
  }

  private pxToTailwind(property: string, px: string): string {
    const value = parseInt(px);
    const remValue = value / 4; // Tailwind uses 0.25rem increments
    
    if (remValue === Math.floor(remValue)) {
      return `${property}-${remValue}`;
    } else {
      return `${property}-[${px}px]`;
    }
  }

  private pxToFontSize(px: string): string {
    const fontSizeMap: Record<string, string> = {
      '12': 'text-xs',
      '14': 'text-sm',
      '16': 'text-base',
      '18': 'text-lg',
      '20': 'text-xl',
      '24': 'text-2xl',
      '30': 'text-3xl',
      '36': 'text-4xl',
      '48': 'text-5xl',
      '60': 'text-6xl',
    };

    return fontSizeMap[px] || `text-[${px}px]`;
  }

  private fontWeightToTailwind(weight: string): string {
    const weightMap: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
    };

    return weightMap[weight] || `font-[${weight}]`;
  }

  optimizeForProduction(css: string): string {
    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove extra whitespace
    css = css.replace(/\s+/g, ' ');
    
    // Remove unnecessary semicolons
    css = css.replace(/;\s*}/g, '}');
    
    return css.trim();
  }

  extractColorPalette(css: string): Record<string, string> {
    const colors: Record<string, string> = {};
    const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/g;
    
    let match;
    let colorIndex = 1;
    
    while ((match = colorRegex.exec(css)) !== null) {
      const colorValue = match[0];
      const colorName = `color-${colorIndex}`;
      
      if (!Object.values(colors).includes(colorValue)) {
        colors[colorName] = colorValue;
        colorIndex++;
      }
    }
    
    return colors;
  }
}

export const postcssProcessor = new PostCSSProcessor();