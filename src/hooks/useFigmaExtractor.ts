
import { useState } from 'react';
import { FigmaDesignData } from '../types/figma';

export const useFigmaExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [data, setData] = useState<FigmaDesignData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFigmaDesign = async (url: string): Promise<void> => {
    setIsExtracting(true);
    setError(null);

    try {
      // Simulate API call - in real implementation, this would call Figma API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data structure
      const mockData: FigmaDesignData = {
        id: 'figma-123',
        name: 'Sample Design',
        components: [
          {
            id: 'comp-1',
            name: 'Button',
            type: 'COMPONENT',
            styles: {
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px'
            }
          },
          {
            id: 'comp-2',
            name: 'Card',
            type: 'FRAME',
            styles: {
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }
          }
        ],
        designTokens: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            background: '#ffffff'
          },
          typography: {
            heading: { fontSize: '24px', fontWeight: 'bold' },
            body: { fontSize: '16px', fontWeight: 'normal' }
          },
          spacing: {
            small: '8px',
            medium: '16px',
            large: '24px'
          }
        },
        metadata: {
          version: '1.0',
          lastModified: new Date().toISOString(),
          author: 'Designer'
        }
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract design');
    } finally {
      setIsExtracting(false);
    }
  };

  const loadDemoUrl = () => {
    return 'https://www.figma.com/file/abc123/Sample-Design';
  };

  return {
    isExtracting,
    data,
    error,
    extractFigmaDesign,
    loadDemoUrl
  };
};
