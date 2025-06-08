
import { useState, useCallback } from 'react';
import { FigmaDesignData } from '../types/figma';

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
      // Simulate API call with enhanced mock data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockData: FigmaDesignData = {
        id: parsedUrl.fileId,
        name: 'Exported Design',
        components: [
          {
            id: 'comp-1',
            name: 'PrimaryButton',
            type: 'COMPONENT',
            styles: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            },
            children: []
          },
          {
            id: 'comp-2',
            name: 'InfoCard',
            type: 'FRAME',
            styles: {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            },
            children: []
          }
        ],
        designTokens: {
          colors: {
            primary: '#6366f1',
            secondary: '#64748b',
            background: '#ffffff',
            surface: '#f8fafc',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
          },
          typography: {
            heading: { fontSize: '24px', fontWeight: '600', lineHeight: '1.2' },
            body: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
            caption: { fontSize: '14px', fontWeight: '400', lineHeight: '1.4' }
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
            '2xl': '48px'
          }
        },
        metadata: {
          version: '2.0',
          lastModified: new Date().toISOString(),
          author: 'Figma User'
        }
      };

      setExtractedData(mockData);
      showToast('Sikeres exportálás', `${mockData.components.length} komponens exportálva`, 'success');
    } catch (error) {
      showToast('Exportálási hiba', 'Nem sikerült exportálni a design-t', 'error');
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
