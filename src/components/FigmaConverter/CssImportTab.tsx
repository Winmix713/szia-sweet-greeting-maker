import React from 'react';
import { Button, Badge, Textarea, Switch } from '@heroui/react';
import { Palette, Zap } from 'lucide-react';
import { ProcessedComponentView } from './ProcessedComponentView';

interface CssImportTabProps {
  figmaCssCode: string;
  setFigmaCssCode: (code: string) => void;
  isProcessingCss: boolean;
  processFigmaCss: (code: string) => void;
  processedComponent: any;
  copyToClipboard: (text: string) => void;
  downloadFile: (content: string, filename: string) => void;
  loadDemoCss: () => void;
}

export const CssImportTab: React.FC<CssImportTabProps> = ({
  figmaCssCode,
  setFigmaCssCode,
  isProcessingCss,
  processFigmaCss,
  processedComponent,
  copyToClipboard,
  downloadFile,
  loadDemoCss
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Palette className="text-purple-500" />
          Full CSS Import
          <Badge color="secondary" size="sm">ADVANCED</Badge>
        </h3>
        <p className="text-sm text-default-500 mb-4">
          Másolj be teljes CSS kódot Figma-ból és készíts tökéletes React komponens másolatot a teljes layout-tal és stílusokkal.
        </p>
        
        <div className="bg-content1 p-3 rounded border text-xs space-y-2">
          <p><strong>Hogyan szerezd meg a CSS kódot:</strong></p>
          <p>1. Figma-ban jelöld ki a komponenst vagy frame-et</p>
          <p>2. Jobb klikk → "Copy as CSS" vagy "Inspect" → "Copy CSS"</p>
          <p>3. Másold be a teljes CSS kódot az alábbi mezőbe</p>
          <p>4. Az alkalmazás automatikusan generál React komponenst és Tailwind osztályokat</p>
          <Button
            size="sm"
            variant="flat"
            onPress={loadDemoCss}
            className="mt-2 h-7 px-2"
            color="secondary"
            startContent={<Palette width={14} />}
          >
            Demo CSS betöltése (Figma button)
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Figma CSS Kód</label>
        <Textarea
          placeholder=".your-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* További Figma CSS stílusok... */
}"
          value={figmaCssCode}
          onValueChange={setFigmaCssCode}
          minRows={8}
          maxRows={12}
          className="font-mono text-sm"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-default-500">
            {figmaCssCode.length} karakter
          </p>
          <Button
            size="sm"
            variant="light"
            onPress={() => setFigmaCssCode("")}
            className="h-6 px-2"
          >
            Törlés
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2 p-3 bg-default-100 rounded-lg">
          <h4 className="text-sm font-medium">Konverziós beállítások</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs">Tailwind osztályok generálása</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">CSS Variables kinyerése</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">Responsive breakpoint-ok</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">Animációk megtartása</label>
              <Switch size="sm" isSelected={true} />
            </div>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-default-100 rounded-lg">
          <h4 className="text-sm font-medium">Kimeneti formátumok</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs">React TypeScript</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">Tiszta CSS</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">HTML + CSS</label>
              <Switch size="sm" isSelected={true} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs">Storybook story</label>
              <Switch size="sm" />
            </div>
          </div>
        </div>
      </div>

      <Button
        onPress={() => processFigmaCss(figmaCssCode)}
        isDisabled={!figmaCssCode.trim() || isProcessingCss}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="lg"
        startContent={isProcessingCss ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Zap width={16} />}
      >
        {isProcessingCss ? "CSS feldolgozása..." : "CSS konvertálása React komponenssé"}
      </Button>

      {processedComponent && (
        <ProcessedComponentView 
          component={processedComponent}
          onCopy={copyToClipboard}
          onDownload={downloadFile}
        />
      )}
    </div>
  );
};
