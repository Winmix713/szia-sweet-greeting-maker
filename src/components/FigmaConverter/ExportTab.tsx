
import React from 'react';
import { Input, Button, Switch } from '@heroui/react';
import { Check, X, Clipboard, Download } from 'lucide-react';

interface ExportTabProps {
  figmaUrl: string;
  setFigmaUrl: (url: string) => void;
  figmaToken: string;
  setFigmaToken: (token: string) => void;
  urlValidation: { isValid: boolean; message: string };
  options: any;
  setOptions: (options: any) => void;
  isExtracting: boolean;
  extractFigmaDesign: (url: string, token: string) => void;
  loadDemoUrl: () => void;
}

export const ExportTab: React.FC<ExportTabProps> = ({
  figmaUrl,
  setFigmaUrl,
  figmaToken,
  setFigmaToken,
  urlValidation,
  options,
  setOptions,
  isExtracting,
  extractFigmaDesign,
  loadDemoUrl
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Figma Frame URL</label>
        <Input
          placeholder="https://www.figma.com/design/fAV7MQVmdjb0TYuUkpvy4V/Untitled?node-id=0-17..."
          value={figmaUrl}
          onChange={(e) => setFigmaUrl(e.target.value)}
          color={figmaUrl && urlValidation.isValid ? "success" : figmaUrl ? "danger" : "default"}
        />
        {figmaUrl && (
          <div className={`text-xs flex items-center gap-1 ${urlValidation.isValid ? 'text-success' : 'text-danger'}`}>
            {urlValidation.isValid ? <Check width={14} /> : <X width={14} />}
            {urlValidation.message}
          </div>
        )}
        <div className="text-xs text-default-500 mt-1 space-y-1">
          <p><strong>Hogyan szerezd meg az URL-t:</strong></p>
          <p>1. Jelöld ki a frame-et vagy komponenst Figma-ban</p>
          <p>2. Jobb klikk → "Copy link to selection"</p>
          <p>3. Illeszd be az URL-t ide</p>
          <Button
            size="sm"
            variant="light"
            onPress={loadDemoUrl}
            className="mt-2 h-7 px-2"
            startContent={<Clipboard width={14} />}
          >
            Demo URL betöltése
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Figma API Token</label>
        <Input
          type="password"
          placeholder="figd_..."
          value={figmaToken}
          onChange={(e) => setFigmaToken(e.target.value)}
        />
        <p className="text-xs text-default-500">
          <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" className="text-primary hover:underline">
            Szerezz be API tokent itt
          </a>
        </p>
      </div>

      <div className="space-y-3 p-4 bg-default-100 rounded-lg">
        <h4 className="text-sm font-medium">Exportálási beállítások</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Design tokenek kinyerése</label>
            <Switch
              isSelected={options.extractDesignTokens}
              onValueChange={(checked) => 
                setOptions(prev => ({ ...prev, extractDesignTokens: checked }))
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Komponens variánsok</label>
            <Switch
              isSelected={options.generateVariants}
              onValueChange={(checked) => 
                setOptions(prev => ({ ...prev, generateVariants: checked }))
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Storybook export</label>
            <Switch
              isSelected={options.generateStorybook}
              onValueChange={(checked) => 
                setOptions(prev => ({ ...prev, generateStorybook: checked }))
              }
              size="sm"
            />
          </div>
        </div>
      </div>

      <Button
        onPress={() => extractFigmaDesign(figmaUrl, figmaToken)}
        isDisabled={isExtracting || !urlValidation.isValid || !figmaToken}
        className="w-full"
        color="primary"
        startContent={isExtracting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Download width={16} />}
      >
        {isExtracting ? "Exportálás..." : "Design exportálása Figma-ból"}
      </Button>
    </div>
  );
};
