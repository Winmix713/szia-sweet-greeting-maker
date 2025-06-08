
import React from "react";
import { Icon } from "@iconify/react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Tabs, 
  Tab, 
  Input, 
  Button, 
  Switch, 
  Badge, 
  Textarea
} from "@heroui/react";

import { useFigmaExtractor } from "../../hooks/use-figma-extractor";
import { useFigmaCssProcessor } from "../../hooks/use-figma-css-processor";
import { useToastNotification } from "../../hooks/use-toast-notification";
import { FigmaComponentCard } from "./FigmaComponentCard";
import { DesignTokensDisplay } from "./DesignTokensDisplay";
import { ProcessedComponentView } from "./ProcessedComponentView";

interface FigmaConverterProps {
  onSvgExtracted?: (svg: string, metadata: any) => void;
}

export const FigmaConverter: React.FC<FigmaConverterProps> = ({ onSvgExtracted }) => {
  const [figmaUrl, setFigmaUrl] = React.useState("");
  const [figmaToken, setFigmaToken] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("extract");
  const [figmaCssCode, setFigmaCssCode] = React.useState("");
  
  // Use custom hooks instead of direct state management
  const { showToast, toastMessage } = useToastNotification();
  
  const { 
    extractFigmaDesign, 
    isExtracting, 
    extractedData, 
    urlValidation,
    parseFigmaUrl,
    options,
    setOptions
  } = useFigmaExtractor({ showToast });
  
  const {
    processFigmaCss,
    isProcessingCss,
    processedComponent,
    generateDesignTokens,
    copyToClipboard,
    downloadFile
  } = useFigmaCssProcessor({ showToast });
  
  // Add demo button functionality
  const loadDemoUrl = () => {
    setFigmaUrl("https://www.figma.com/design/fAV7MQVmdjb0TYuUkpvy4V/Untitled?node-id=0-17&t=Unl6oKVIBByFI4Ba-4");
    showToast("Demo URL betöltve", "Most add meg a Figma API tokent az exportáláshoz", "success");
  };
  
  // Load demo CSS for testing
  const loadDemoCss = () => {
    const demoCss = `/* button */

box-sizing: border-box;

/* Auto layout */
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 8px;
gap: 10px;
isolation: isolate;

position: relative;
width: 223px;
height: 60px;

background: #F1F1F1;
border-top: 0.5px solid rgba(40, 40, 40, 0.1);
/* input-light */
box-shadow: inset 0px -1px 0px rgba(255, 255, 255, 0.8), inset 0px 6px 13px rgba(24, 24, 24, 0.03), inset 0px 6px 4px -4px rgba(24, 24, 24, 0.05), inset 0px 4.5px 1.5px -4px rgba(24, 24, 24, 0.07);
border-radius: 100px;

/* Frame 1000002498 */
.frame-content {
box-sizing: border-box;

/* Auto layout */
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 12px 32px;
gap: 10px;

width: 207px;
height: 44px;

background: rgba(253, 253, 253, 0.7);
/* depth-light */
box-shadow: 0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25), 0px 24px 24px -16px rgba(8, 8, 8, 0.04), 0px 6px 13px rgba(8, 8, 8, 0.03), 0px 6px 4px -4px rgba(8, 8, 8, 0.05), 0px 5px 1.5px -4px rgba(8, 8, 8, 0.09);
backdrop-filter: blur(32px);
border-radius: 90px;

flex: none;
order: 1;
flex-grow: 0;
z-index: 1;
}`;
    
    setFigmaCssCode(demoCss);
    showToast("Demo CSS betöltve", "Figma komponens CSS kód beillesztve a teszteléshez", "success");
  };
  
  // Real-time URL validation
  React.useEffect(() => {
    if (!figmaUrl.trim()) {
      return;
    }
    
    parseFigmaUrl(figmaUrl);
  }, [figmaUrl, parseFigmaUrl]);
  
  const handleComponentSelect = (component: any) => {
    if (onSvgExtracted) {
      onSvgExtracted(component.svg || '', {
        name: component.name,
        type: component.type,
        styles: component.styles,
        designTokens: component.designTokens
      });
    }
    
    showToast("Komponens betöltve", `${component.name} sikeresen betöltve a konvertálóba`, "success");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white text-sm font-bold">
          F
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Figma to JSX Pro</h2>
            <Badge color="secondary" size="sm" className="h-5">BETA</Badge>
          </div>
          <p className="text-xs text-default-500">Figma design to React component converter</p>
        </div>
      </CardHeader>
    
      <CardBody className="px-4 py-0">
        <Tabs 
          aria-label="Figma Converter Options" 
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="extract" title="Exportálás">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Figma Frame URL</label>
                <Input
                  placeholder="https://www.figma.com/design/fAV7MQVmdjb0TYuUkpvy4V/Untitled?node-id=0-17..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  color={figmaUrl && (urlValidation.isValid ? "success" : "danger")}
                />
                {figmaUrl && (
                  <div className={`text-xs flex items-center gap-1 ${urlValidation.isValid ? 'text-success' : 'text-danger'}`}>
                    <Icon icon={urlValidation.isValid ? "lucide:check" : "lucide:x"} width={14} />
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
                    startContent={<Icon icon="lucide:clipboard" width={14} />}
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
                startContent={isExtracting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Icon icon="lucide:download" width={16} />}
              >
                {isExtracting ? "Exportálás..." : "Design exportálása Figma-ból"}
              </Button>
            </div>
          </Tab>
    
          <Tab key="css-import" title="Full CSS Import">
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Icon icon="lucide:palette" className="text-purple-500" />
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
                    startContent={<Icon icon="lucide:palette" width={14} />}
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
                startContent={isProcessingCss ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Icon icon="lucide:zap" width={16} />}
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
          </Tab>
    
          <Tab key="components" title="Komponensek">
            <div className="space-y-4 py-4">
              {extractedData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Exportált komponensek</h3>
                    <Badge variant="flat" size="sm">
                      {extractedData.components.length} komponens
                    </Badge>
                  </div>
                  
                  {extractedData.components.map((component: any) => (
                    <FigmaComponentCard
                      key={component.id}
                      component={component}
                      onSelect={handleComponentSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  <Icon icon="lucide:box" className="mx-auto mb-2 w-10 h-10 opacity-50" />
                  <p>Még nincsenek exportált komponensek</p>
                  <p className="text-sm">Exportálj design-okat a Figma tab-ban</p>
                </div>
              )}
            </div>
          </Tab>
    
          <Tab key="tokens" title="Design Tokens">
            <div className="space-y-4 py-4">
              {extractedData ? (
                <DesignTokensDisplay 
                  designTokens={extractedData.designTokens}
                  generatedTokensCode={generateDesignTokens(extractedData)}
                  onCopy={copyToClipboard}
                />
              ) : (
                <div className="text-center py-8 text-default-500">
                  <Icon icon="lucide:palette" className="mx-auto mb-2 w-10 h-10 opacity-50" />
                  <p>Még nincsenek design tokenek</p>
                  <p className="text-sm">Exportálj design-okat a Figma tab-ban</p>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    
      <CardFooter className="flex justify-between items-center px-4 py-3 border-t">
        <div className="text-xs text-default-500">
          Figma to JSX Pro v0.2.0
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="light"
            startContent={<Icon icon="lucide:help-circle" width={14} />}
          >
            Súgó
          </Button>
          <Button
            size="sm"
            color="primary"
            startContent={<Icon icon="lucide:settings" width={14} />}
          >
            Beállítások
          </Button>
        </div>
      </CardFooter>
    
      {/* Toast notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 flex items-center gap-3 transition-all duration-300 ${
          toastMessage.type === "success" ? "bg-success text-white" :
          toastMessage.type === "error" ? "bg-danger text-white" :
          "bg-foreground text-background"
        }`}>
          <Icon 
            icon={
              toastMessage.type === "success" ? "lucide:check-circle" :
              toastMessage.type === "error" ? "lucide:alert-circle" :
              "lucide:info"
            } 
            width={20} 
          />
          <div>
            <h4 className="font-medium text-sm">{toastMessage.title}</h4>
            <p className="text-xs opacity-90">{toastMessage.description}</p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="ml-auto text-white/80 hover:text-white"
            onPress={() => showToast("", "", "info", true)}
          >
            <Icon icon="lucide:x" width={14} />
          </Button>
        </div>
      )}
    </Card>
  );
};
