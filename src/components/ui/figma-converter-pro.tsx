import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Download, 
  Upload, 
  Search, 
  Palette, 
  Code, 
  Eye,
  Settings,
  Figma,
  FileCode,
  Wand2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFigmaExtractor } from '@/hooks/use-figma-extractor';
import { useFigmaCssProcessor } from '@/hooks/use-figma-css-processor';
import { useToastNotification } from '@/hooks/use-toast-notification';

interface FigmaConverterProProps {
  className?: string;
  onSvgExtracted?: (svg: string, metadata: any) => void;
}

export const FigmaConverterPro: React.FC<FigmaConverterProProps> = ({ 
  className, 
  onSvgExtracted 
}) => {
  const { toastMessage, showToast } = useToastNotification();
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [cssCode, setCssCode] = useState('');
  
  const {
    isExtracting,
    extractedData,
    urlValidation,
    options,
    setOptions,
    extractFigmaDesign,
    parseFigmaUrl
  } = useFigmaExtractor({ showToast });

  const {
    isProcessingCss,
    processedComponent,
    processFigmaCss
  } = useFigmaCssProcessor({ showToast });

  const handleFigmaUrlChange = (value: string) => {
    setFigmaUrl(value);
    parseFigmaUrl(value);
  };

  const loadDemoUrl = () => {
    const demoUrl = 'https://www.figma.com/file/demo123/Sample-Design-System';
    setFigmaUrl(demoUrl);
    parseFigmaUrl(demoUrl);
    showToast('Demo URL loaded', 'Add your Figma token to extract', 'info');
  };

  const loadDemoCss = () => {
    const demoCSS = `.figma-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.figma-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}`;
    setCssCode(demoCSS);
    showToast('Demo CSS loaded', 'Enhanced demo CSS loaded with responsive design', 'info');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied!', 'Content copied to clipboard', 'success');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download Started', `${filename} is being downloaded`, 'success');
  };

  return (
    <div className={cn(
      "relative w-full max-w-4xl mx-auto",
      "bg-[#0B0D11] border border-[rgba(40,46,63,0.3)] rounded-3xl",
      "backdrop-blur-xl shadow-2xl",
      "min-h-[800px] p-8",
      className
    )}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20" />
            <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-600/10 p-3 rounded-2xl border border-white/10">
              <Figma className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#282E3F] opacity-60 tracking-[-2px]">
              Figma to JSX Pro
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Convert Figma designs to production-ready React components
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 text-sm font-medium">BETA</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[rgba(24,27,36,0.21)] rounded-2xl backdrop-blur-[10px]" />
          <div className="relative flex items-center gap-3 p-4 border border-white/10 rounded-2xl bg-gradient-to-r from-[rgba(5,7,12,0.63)] to-[rgba(24,27,36,0.21)]">
            <Search className="w-5 h-5 text-white/60" />
            <Input
              placeholder="Search components, extract designs..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0"
              value={figmaUrl}
              onChange={(e) => handleFigmaUrlChange(e.target.value)}
            />
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-b from-[rgba(31,37,48,0.6)] to-[#14171C] border border-black/20">
              <span className="text-white/50 text-sm">⌘</span>
              <span className="text-white/50 text-sm">F</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-white/10 rounded-2xl p-1">
          <TabsTrigger 
            value="export" 
            className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Figma Export
          </TabsTrigger>
          <TabsTrigger 
            value="css" 
            className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl"
          >
            <FileCode className="w-4 h-4 mr-2" />
            CSS Import
          </TabsTrigger>
          <TabsTrigger 
            value="components" 
            className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl"
          >
            <Code className="w-4 h-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger 
            value="tokens" 
            className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl"
          >
            <Palette className="w-4 h-4 mr-2" />
            Design Tokens
          </TabsTrigger>
        </TabsList>

        {/* Figma Export Tab */}
        <TabsContent value="export" className="mt-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Figma className="w-5 h-5" />
                Extract from Figma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label className="text-white/80">Figma File URL</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => handleFigmaUrlChange(e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                  <Button 
                    variant="outline" 
                    onClick={loadDemoUrl}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Demo
                  </Button>
                </div>
                {urlValidation.message && (
                  <p className={cn(
                    "text-sm",
                    urlValidation.isValid ? "text-green-400" : "text-red-400"
                  )}>
                    {urlValidation.message}
                  </p>
                )}
              </div>

              {/* Token Input */}
              <div className="space-y-2">
                <Label className="text-white/80">Figma Access Token</Label>
                <Input
                  type="password"
                  placeholder="figd_..."
                  value={figmaToken}
                  onChange={(e) => setFigmaToken(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <Label className="text-white/80">Export Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(options).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <Label className="text-white/80 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setOptions({ ...options, [key]: checked })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Extract Button */}
              <Button
                onClick={() => extractFigmaDesign(figmaUrl, figmaToken)}
                disabled={isExtracting || !urlValidation.isValid || !figmaToken}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isExtracting ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Design
                  </>
                )}
              </Button>

              {/* Results */}
              {extractedData && (
                <div className="space-y-4 mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Extraction Results</h3>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      {extractedData.components.length} components
                    </Badge>
                  </div>
                  <div className="grid gap-2">
                    {extractedData.components.slice(0, 3).map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                        <span className="text-white/80 text-sm">{component.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {component.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSS Import Tab */}
        <TabsContent value="css" className="mt-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                Import CSS Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">CSS Code</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadDemoCss}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Load Demo
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste your Figma CSS code here..."
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/40 font-mono"
                />
              </div>

              <Button
                onClick={() => processFigmaCss(cssCode)}
                disabled={isProcessingCss || !cssCode.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                {isProcessingCss ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Process CSS
                  </>
                )}
              </Button>

              {/* Processed Component Preview */}
              {processedComponent && (
                <div className="space-y-4 mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{processedComponent.name}</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(processedComponent.reactCode)}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadFile(processedComponent.reactCode, `${processedComponent.name}.tsx`)}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <Badge variant="secondary" className="text-center">
                      {processedComponent.stats.cssRules} Rules
                    </Badge>
                    <Badge variant="secondary" className="text-center">
                      {processedComponent.stats.animations} Animations
                    </Badge>
                    <Badge variant="secondary" className="text-center">
                      {processedComponent.stats.responsiveBreakpoints} Responsive
                    </Badge>
                    <Badge variant="secondary" className="text-center">
                      {processedComponent.stats.customProperties} Variables
                    </Badge>
                  </div>

                  <pre className="bg-black/40 text-green-300 p-4 rounded text-xs overflow-auto max-h-40 border border-white/10">
                    <code>{processedComponent.reactCode.slice(0, 500)}...</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="mt-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Generated Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              {extractedData ? (
                <div className="grid gap-4">
                  {extractedData.components.map((component, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">{component.name}</h3>
                        <Badge variant="outline">{component.type}</Badge>
                      </div>
                      
                      {/* Component Preview */}
                      <div className="mb-3 p-3 rounded bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-2">Preview:</div>
                        <div 
                          className="p-2 rounded bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
                          style={component.styles}
                        >
                          {component.name} Component
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(JSON.stringify(component.styles, null, 2))}
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Styles
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No components extracted yet.</p>
                  <p className="text-sm">Extract from Figma or import CSS to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Tokens Tab */}
        <TabsContent value="tokens" className="mt-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Design Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              {extractedData ? (
                <div className="space-y-6">
                  {/* Colors */}
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-blue-500 rounded-full" />
                      Colors
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(extractedData.designTokens.colors).map(([name, color]) => (
                        <div key={name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div 
                            className="w-full h-8 rounded mb-2 border border-white/10"
                            style={{ backgroundColor: color }}
                          />
                          <div className="text-white/80 text-sm font-medium">{name}</div>
                          <div className="text-white/40 text-xs font-mono">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span className="text-lg">Aa</span>
                      Typography
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(extractedData.designTokens.typography).map(([name, styles]) => (
                        <div key={name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-white/80 text-sm mb-1">{name}</div>
                          <div 
                            className="text-white mb-2"
                            style={typeof styles === 'object' ? styles : {}}
                          >
                            The quick brown fox jumps over the lazy dog
                          </div>
                          <div className="text-white/40 text-xs">
                            {typeof styles === 'object' ? 
                              Object.entries(styles).map(([prop, val]) => `${prop}: ${val}`).join(', ') 
                              : styles
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Spacing
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(extractedData.designTokens.spacing).map(([name, value]) => (
                        <div key={name} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                          <div className="text-white/80 text-sm mb-2">{name}</div>
                          <div className="flex justify-center mb-2">
                            <div 
                              className="bg-blue-400 rounded"
                              style={{ 
                                width: value, 
                                height: value, 
                                minWidth: '4px', 
                                minHeight: '4px',
                                maxWidth: '32px',
                                maxHeight: '32px'
                              }}
                            />
                          </div>
                          <div className="text-white/40 text-xs font-mono">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No design tokens available.</p>
                  <p className="text-sm">Extract from Figma to see design tokens.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-white max-w-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{toastMessage.title}</div>
                <div className="text-sm text-white/60">{toastMessage.description}</div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {}}
                className="text-white/60 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};