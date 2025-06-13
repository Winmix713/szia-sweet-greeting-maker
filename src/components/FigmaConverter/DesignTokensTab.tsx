
import React from 'react';
import { Palette } from 'lucide-react';
import { DesignTokensDisplay } from './DesignTokensDisplay';

interface DesignTokensTabProps {
  extractedData: any;
  generateDesignTokens: (data: any) => string;
  copyToClipboard: (text: string) => void;
}

export const DesignTokensTab: React.FC<DesignTokensTabProps> = ({
  extractedData,
  generateDesignTokens,
  copyToClipboard
}) => {
  return (
    <div className="space-y-4 py-4">
      {extractedData ? (
        <DesignTokensDisplay 
          designTokens={extractedData.designTokens}
          generatedTokensCode={generateDesignTokens(extractedData)}
          onCopy={copyToClipboard}
        />
      ) : (
        <div className="text-center py-8 text-default-500">
          <Palette className="mx-auto mb-2 w-10 h-10 opacity-50" />
          <p>Még nincsenek design tokenek</p>
          <p className="text-sm">Exportálj design-okat a Figma tab-ban</p>
        </div>
      )}
    </div>
  );
};
