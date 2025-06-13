
import { useState, useCallback } from 'react';
import { FigmaDesignData } from '../types/figma';
import { FigmaAPI } from '@/lib/figma-api';

interface FigmaExportOptions {
  extractDesignTokens: boolean;
  generateVariants: boolean;
  includeResponsive: boolean;
  optimizeForProduction: boolean;
  extractColors: boolean;
  extractTypography: boolean;
  generateStorybook: boolean;
}

interface UrlValidation {
  isValid: boolean;
  message: string;
}

interface UseFigmaExtractorProps {
  showToast: (title: string, description: string, type: 'success' | 'error' | 'info') => void;
}

export const useFigmaExtractor = ({ showToast }: UseFigmaExtractorProps) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<FigmaDesignData | null>(null);
  const [urlValidation, setUrlValidation] = useState<UrlValidation>({ isValid: false, message: '' });
  const [options, setOptions] = useState<FigmaExportOptions>({
    extractDesignTokens: true,
    generateVariants: false,
    includeResponsive: true,
    optimizeForProduction: false,
    extractColors: true,
    extractTypography: true,
    generateStorybook: false
  });

  const parseFigmaUrl = useCallback((url: string) => {
    const figmaUrlPattern = /^https:\/\/(www\.)?figma\.com\/(design|file|proto)\/([a-zA-Z0-9]+)/;
    const match = url.match(figmaUrlPattern);
    
    if (!match) {
      setUrlValidation({ isValid: false, message: 'Érvénytelen Figma URL formátum' });
      return null;
    }

    const nodeIdMatch = url.match(/node-id=([^&]+)/);
    
    setUrlValidation({ 
      isValid: true, 
      message: nodeIdMatch ? 'Érvényes URL node ID-val' : 'Érvényes URL, de nincs konkrét node kiválasztva'
    });

    return {
      fileId: match[3],
      nodeId: nodeIdMatch ? nodeIdMatch[1] : null
    };
  }, []);

  const extractFigmaDesign = useCallback(async (url: string, token: string) => {
    if (!url || !token) {
      showToast('Hiányzó adatok', 'Add meg a Figma URL-t és az API tokent', 'error');
      return;
    }

    const parsedUrl = parseFigmaUrl(url);
    if (!parsedUrl) {
      showToast('Érvénytelen URL', 'Ellenőrizd a Figma URL formátumát', 'error');
      return;
    }

    setIsExtracting(true);

    try {
      const figmaAPI = new FigmaAPI(token);
      
      // Get the Figma file data
      const figmaFile = await figmaAPI.getFile(parsedUrl.fileId);
      
      // Extract design tokens
      const designTokens = figmaAPI.extractDesignTokens(figmaFile);
      
      // Convert to components
      const components = figmaAPI.convertToComponents(figmaFile);

      const extractedData: FigmaDesignData = {
        id: parsedUrl.fileId,
        name: figmaFile.name,
        components: components,
        designTokens: designTokens,
        metadata: {
          version: figmaFile.version,
          lastModified: figmaFile.lastModified,
          author: 'Figma API',
        },
      };

      setExtractedData(extractedData);
      showToast('Success', `Successfully extracted "${figmaFile.name}" with ${components.length} components`, 'success');
    } catch (error) {
      console.error('Error extracting Figma design:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        showToast('Error', 'Invalid Figma token. Please check your access token.', 'error');
      } else if (error instanceof Error && error.message.includes('403')) {
        showToast('Error', 'Access denied. Please ensure you have permission to access this file.', 'error');
      } else if (error instanceof Error && error.message.includes('404')) {
        showToast('Error', 'File not found. Please check the Figma URL.', 'error');
      } else {
        showToast('Error', 'Failed to extract Figma design. Please check your URL and token.', 'error');
      }
    } finally {
      setIsExtracting(false);
    }
  }, [parseFigmaUrl, showToast]);

  return {
    extractFigmaDesign,
    isExtracting,
    extractedData,
    urlValidation,
    parseFigmaUrl,
    options,
    setOptions
  };
};
