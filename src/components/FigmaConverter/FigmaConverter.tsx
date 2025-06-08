
import React from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";

import { useFigmaExtractor } from "../../hooks/use-figma-extractor";
import { useFigmaCssProcessor } from "../../hooks/use-figma-css-processor";
import { useToastNotification } from "../../hooks/use-toast-notification";
import { FigmaConverterHeader } from "./FigmaConverterHeader";
import { FigmaConverterFooter } from "./FigmaConverterFooter";
import { ExportTab } from "./ExportTab";
import { CssImportTab } from "./CssImportTab";
import { ComponentsTab } from "./ComponentsTab";
import { DesignTokensTab } from "./DesignTokensTab";
import { ToastNotification } from "./ToastNotification";

interface FigmaConverterProps {
  onSvgExtracted?: (svg: string, metadata: any) => void;
}

export const FigmaConverter: React.FC<FigmaConverterProps> = ({ onSvgExtracted }) => {
  const [figmaUrl, setFigmaUrl] = React.useState("");
  const [figmaToken, setFigmaToken] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("extract");
  const [figmaCssCode, setFigmaCssCode] = React.useState("");
  
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
  
  const loadDemoUrl = () => {
    setFigmaUrl("https://www.figma.com/design/fAV7MQVmdjb0TYuUkpvy4V/Untitled?node-id=0-17&t=Unl6oKVIBByFI4Ba-4");
    showToast("Demo URL betöltve", "Most add meg a Figma API tokent az exportáláshoz", "success");
  };
  
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
      <FigmaConverterHeader />
    
      <CardBody className="px-4 py-0">
        <Tabs 
          aria-label="Figma Converter Options" 
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="extract" title="Exportálás">
            <ExportTab
              figmaUrl={figmaUrl}
              setFigmaUrl={setFigmaUrl}
              figmaToken={figmaToken}
              setFigmaToken={setFigmaToken}
              urlValidation={urlValidation}
              options={options}
              setOptions={setOptions}
              isExtracting={isExtracting}
              extractFigmaDesign={extractFigmaDesign}
              loadDemoUrl={loadDemoUrl}
            />
          </Tab>
    
          <Tab key="css-import" title="Full CSS Import">
            <CssImportTab
              figmaCssCode={figmaCssCode}
              setFigmaCssCode={setFigmaCssCode}
              isProcessingCss={isProcessingCss}
              processFigmaCss={processFigmaCss}
              processedComponent={processedComponent}
              copyToClipboard={copyToClipboard}
              downloadFile={downloadFile}
              loadDemoCss={loadDemoCss}
            />
          </Tab>
    
          <Tab key="components" title="Komponensek">
            <ComponentsTab
              extractedData={extractedData}
              handleComponentSelect={handleComponentSelect}
            />
          </Tab>
    
          <Tab key="tokens" title="Design Tokens">
            <DesignTokensTab
              extractedData={extractedData}
              generateDesignTokens={generateDesignTokens}
              copyToClipboard={copyToClipboard}
            />
          </Tab>
        </Tabs>
      </CardBody>
    
      <FigmaConverterFooter />
    
      {toastMessage && (
        <ToastNotification
          toastMessage={toastMessage}
          onClose={() => showToast("", "", "info", true)}
        />
      )}
    </Card>
  );
};
