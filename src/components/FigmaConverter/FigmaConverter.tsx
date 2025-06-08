
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Code, Palette } from 'lucide-react';
import { useFigmaExtractor } from '../../hooks/useFigmaExtractor';
import { useFigmaCssProcessor } from '../../hooks/useFigmaCssProcessor';
import { FigmaConverterProps } from '../../types/figma';
import { cn } from '@/lib/utils';

const FigmaConverter = ({ className }: FigmaConverterProps) => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const { toast } = useToast();

  const {
    isExtracting,
    data: figmaData,
    error: figmaError,
    extractFigmaDesign,
    loadDemoUrl
  } = useFigmaExtractor();

  const {
    isProcessing,
    processedComponent,
    error: cssError,
    processCss,
    loadDemoCSS,
    clearResult
  } = useFigmaCssProcessor();

  // Validate Figma URL
  useEffect(() => {
    const figmaUrlPattern = /^https:\/\/(www\.)?figma\.com\/(file|proto)\/[a-zA-Z0-9]+/;
    setIsValidUrl(figmaUrlPattern.test(figmaUrl));
  }, [figmaUrl]);

  const handleFigmaExtract = async () => {
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Figma URL",
        variant: "destructive"
      });
      return;
    }

    try {
      await extractFigmaDesign(figmaUrl);
      toast({
        title: "Success!",
        description: "Figma design extracted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: figmaError || "Failed to extract Figma design",
        variant: "destructive"
      });
    }
  };

  const handleCssProcess = async () => {
    if (!cssContent.trim()) {
      toast({
        title: "No CSS Content",
        description: "Please enter some CSS to process",
        variant: "destructive"
      });
      return;
    }

    try {
      await processCss(cssContent);
      toast({
        title: "Success!",
        description: "CSS processed and React component generated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: cssError || "Failed to process CSS",
        variant: "destructive"
      });
    }
  };

  const handleLoadDemoUrl = () => {
    setFigmaUrl(loadDemoUrl());
  };

  const handleLoadDemoCSS = () => {
    setCssContent(loadDemoCSS());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard"
    });
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6", className)}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Figma to React Converter</h1>
        <p className="text-muted-foreground">
          Convert Figma designs to React components or transform CSS into modern React code
        </p>
      </div>

      <Tabs defaultValue="figma" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="figma" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Figma Export
          </TabsTrigger>
          <TabsTrigger value="css" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            CSS Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="figma" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="figma-url">Figma File URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="figma-url"
                  placeholder="https://www.figma.com/file/..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  className={!isValidUrl && figmaUrl ? "border-destructive" : ""}
                />
                <Button variant="outline" onClick={handleLoadDemoUrl}>
                  Demo URL
                </Button>
              </div>
              {figmaUrl && !isValidUrl && (
                <p className="text-sm text-destructive mt-1">
                  Please enter a valid Figma URL
                </p>
              )}
            </div>

            <Button
              onClick={handleFigmaExtract}
              disabled={!isValidUrl || isExtracting}
              className="w-full"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Design...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Extract Design
                </>
              )}
            </Button>
          </div>

          {figmaData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Extracted Design Data</h3>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(figmaData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="css" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="css-content">CSS Content</Label>
              <div className="flex gap-2 mt-1 mb-2">
                <Button variant="outline" onClick={handleLoadDemoCSS}>
                  Load Demo CSS
                </Button>
                {processedComponent && (
                  <Button variant="outline" onClick={clearResult}>
                    Clear Result
                  </Button>
                )}
              </div>
              <textarea
                id="css-content"
                placeholder="Paste your CSS here..."
                value={cssContent}
                onChange={(e) => setCssContent(e.target.value)}
                className="w-full h-40 p-3 border border-input rounded-md bg-background text-sm font-mono"
              />
            </div>

            <Button
              onClick={handleCssProcess}
              disabled={!cssContent.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing CSS...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 mr-2" />
                  Generate React Component
                </>
              )}
            </Button>
          </div>

          {processedComponent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Component: {processedComponent.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(processedComponent.code)}
                >
                  Copy Code
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  <code>{processedComponent.code}</code>
                </pre>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Generated Tailwind Classes:</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <code>{processedComponent.styles}</code>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Props Interface:</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <pre>{processedComponent.props}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FigmaConverter;
