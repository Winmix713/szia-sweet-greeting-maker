
import { useState } from 'react';
import { ProcessedComponent } from '../types/figma';
import {
  extractComponentNameFromCss,
  parseFigmaCssBlocks,
  extractDeclarationsFromBlock,
  convertCssToTailwind
} from '../utils/figma-css-parser';
import { generateReactComponentFromCss } from '../utils/code-generator';

export const useFigmaCssProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedComponent, setProcessedComponent] = useState<ProcessedComponent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processCss = async (cssContent: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const componentName = extractComponentNameFromCss(cssContent);
      const blocks = parseFigmaCssBlocks(cssContent);
      
      if (blocks.length === 0) {
        throw new Error('No valid CSS blocks found');
      }

      // Process the first block (main component)
      const mainBlock = blocks[0];
      const declarations = extractDeclarationsFromBlock(mainBlock);
      const tailwindClasses = convertCssToTailwind(declarations);

      const component = generateReactComponentFromCss(componentName, tailwindClasses, declarations);
      setProcessedComponent(component);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSS');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadDemoCSS = (): string => {
    return `/* Button Component */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}`;
  };

  return {
    isProcessing,
    processedComponent,
    error,
    processCss,
    loadDemoCSS,
    clearResult: () => setProcessedComponent(null)
  };
};
