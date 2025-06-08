
import { useState, useCallback } from 'react';
import { ProcessedComponent } from '../types/figma';
import {
  extractComponentNameFromCss,
  parseFigmaCssBlocks,
  extractDeclarationsFromBlock,
  convertCssToTailwind
} from '../utils/figma-css-parser';
import { generateReactComponentFromCss } from '../utils/code-generator';

interface UseFigmaCssProcessorProps {
  showToast: (title: string, description: string, type: 'success' | 'error' | 'info') => void;
}

export const useFigmaCssProcessor = ({ showToast }: UseFigmaCssProcessorProps) => {
  const [isProcessingCss, setIsProcessingCss] = useState(false);
  const [processedComponent, setProcessedComponent] = useState<ProcessedComponent | null>(null);

  const processFigmaCss = useCallback(async (cssContent: string) => {
    if (!cssContent.trim()) {
      showToast('Nincs CSS tartalom', 'Adj meg CSS kódot a feldolgozáshoz', 'error');
      return;
    }

    setIsProcessingCss(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const componentName = extractComponentNameFromCss(cssContent);
      const blocks = parseFigmaCssBlocks(cssContent);
      
      if (blocks.length === 0) {
        throw new Error('Nem található érvényes CSS blokk');
      }

      const mainBlock = blocks[0];
      const declarations = extractDeclarationsFromBlock(mainBlock);
      const tailwindClasses = convertCssToTailwind(declarations);

      const component = generateReactComponentFromCss(componentName, tailwindClasses, declarations);
      
      // Enhanced processed component with additional data
      const enhancedComponent: ProcessedComponent = {
        ...component,
        originalCss: cssContent,
        reactCode: component.code,
        styledCss: Object.entries(declarations)
          .map(([prop, value]) => `${prop}: ${value};`)
          .join('\n'),
        htmlStructure: `<div className="${tailwindClasses.join(' ')}">\n  {children}\n</div>`,
        tailwindClasses: {
          main: tailwindClasses.join(' '),
          customStyles: []
        },
        stats: {
          cssRules: Object.keys(declarations).length,
          responsiveBreakpoints: 0,
          animations: cssContent.includes('transition') || cssContent.includes('animation') ? 1 : 0,
          customProperties: (cssContent.match(/--[\w-]+:/g) || []).length
        }
      };

      setProcessedComponent(enhancedComponent);
      showToast('CSS feldolgozva', 'React komponens sikeresen generálva', 'success');
    } catch (error) {
      showToast('Feldolgozási hiba', error instanceof Error ? error.message : 'Ismeretlen hiba', 'error');
    } finally {
      setIsProcessingCss(false);
    }
  }, [showToast]);

  const generateDesignTokens = useCallback((data: any) => {
    const tokens = data?.designTokens || {};
    
    return `// Design Tokens
export const designTokens = {
  colors: ${JSON.stringify(tokens.colors || {}, null, 2)},
  typography: ${JSON.stringify(tokens.typography || {}, null, 2)},
  spacing: ${JSON.stringify(tokens.spacing || {}, null, 2)}
};`;
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Másolva', 'A kód a vágólapra másolva', 'success');
  }, [showToast]);

  const downloadFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Letöltve', `${filename} sikeresen letöltve`, 'success');
  }, [showToast]);

  return {
    processFigmaCss,
    isProcessingCss,
    processedComponent,
    generateDesignTokens,
    copyToClipboard,
    downloadFile
  };
};
