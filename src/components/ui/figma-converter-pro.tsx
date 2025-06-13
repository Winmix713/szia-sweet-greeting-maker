
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  Code,
  Palette,
  FileText,
  Zap,
  Copy,
  Github,
  Figma,
  Layers,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

// Types and Interfaces
interface FigmaNode {
  id: string;
  name: string;
  type: string;
  styles?: Record<string, any>;
  children?: FigmaNode[];
}

interface ProcessedComponent {
  id: string;
  name: string;
  code: string;
  preview: string;
  styles: string;
  dependencies: string[];
  props?: Record<string, any>;
}

interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow';
  category: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface FigmaConverterProps {
  className?: string;
}

// Sample Data
const SAMPLE_COMPONENTS: ProcessedComponent[] = [
  {
    id: "1",
    name: "Button",
    code: `interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children,
  onClick 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}`,
    preview: "Interactive button component with variants and sizes",
    styles: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700",
    dependencies: ["react", "@types/react"],
    props: { variant: "primary", size: "md" }
  },
  {
    id: "2",
    name: "Card",
    code: `interface CardProps {
  title: string;
  content: string;
  image?: string;
  className?: string;
}

export function Card({ title, content, image, className = "" }: CardProps) {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover rounded-md mb-4" 
        />
      )}
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}`,
    preview: "Responsive card component with optional image",
    styles: "bg-white rounded-lg shadow-md p-6",
    dependencies: ["react", "@types/react"],
    props: { title: "Sample Card", content: "Card description" }
  }
];

const SAMPLE_DESIGN_TOKENS: DesignToken[] = [
  { name: "primary-500", value: "#3B82F6", type: "color", category: "Primary Colors" },
  { name: "gray-100", value: "#F3F4F6", type: "color", category: "Neutral Colors" },
  { name: "spacing-4", value: "1rem", type: "spacing", category: "Spacing Scale" },
  { name: "text-lg", value: "18px", type: "typography", category: "Font Sizes" },
  { name: "shadow-md", value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", type: "shadow", category: "Shadows" }
];

// Custom Hooks
function useToastNotification() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}

function useFigmaExtractor() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<FigmaNode[]>([]);

  const extractFromUrl = async (url: string, token: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data
      const mockData: FigmaNode[] = [
        {
          id: "1",
          name: "Button Component",
          type: "COMPONENT",
          styles: { backgroundColor: "#3B82F6", color: "#FFFFFF" }
        },
        {
          id: "2", 
          name: "Card Component",
          type: "COMPONENT",
          styles: { backgroundColor: "#FFFFFF", borderRadius: "8px" }
        }
      ];
      
      setExtractedData(mockData);
      return mockData;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, extractedData, extractFromUrl };
}

function useFigmaCssProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedComponents, setProcessedComponents] = useState<ProcessedComponent[]>([]);

  const processCss = async (cssCode: string, componentName: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock CSS processing
      const processed: ProcessedComponent = {
        id: Date.now().toString(),
        name: componentName || "ProcessedComponent",
        code: `export function ${componentName}() {\n  return (\n    <div className="bg-white p-4 rounded-lg shadow-md">\n      {/* Generated from Figma CSS */}\n    </div>\n  );\n}`,
        preview: `Generated ${componentName} component`,
        styles: "bg-white p-4 rounded-lg shadow-md",
        dependencies: ["react"]
      };
      
      setProcessedComponents(prev => [...prev, processed]);
      return processed;
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, processedComponents, processCss };
}

function FigmaConverter({ className = "" }: FigmaConverterProps) {
  // State Management
  const [activeTab, setActiveTab] = useState("export");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [includeTests, setIncludeTests] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Custom Hooks
  const { toasts, showToast, removeToast } = useToastNotification();
  const { isLoading: isFigmaLoading, extractedData, extractFromUrl } = useFigmaExtractor();
  const { isProcessing, processedComponents, processCss } = useFigmaCssProcessor();

  // Event Handlers
  const handleFigmaExtract = async () => {
    if (!figmaUrl || !accessToken) {
      showToast('error', 'Missing Information', 'Please provide both Figma URL and access token');
      return;
    }

    try {
      await extractFromUrl(figmaUrl, accessToken);
      showToast('success', 'Success', 'Figma data extracted successfully');
      setActiveTab("components");
    } catch (error) {
      showToast('error', 'Extraction Failed', 'Failed to extract data from Figma');
    }
  };

  const handleCssProcess = async () => {
    if (!cssCode.trim()) {
      showToast('error', 'Missing CSS', 'Please paste your Figma CSS code');
      return;
    }

    try {
      await processCss(cssCode, componentName || 'Component');
      showToast('success', 'Success', 'CSS processed and component generated');
      setActiveTab("components");
    } catch (error) {
      showToast('error', 'Processing Failed', 'Failed to process CSS code');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', 'Copied', 'Code copied to clipboard');
    } catch (error) {
      showToast('error', 'Copy Failed', 'Failed to copy to clipboard');
    }
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Downloaded', `${filename} downloaded successfully`);
  };

  const validateFigmaUrl = (url: string) => {
    const figmaUrlPattern = /^https:\/\/([\w\.-]+\.)?figma\.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/;
    return figmaUrlPattern.test(url);
  };

    return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Figma className="h-8 w-8 text-purple-600" />
            </div>
            <Zap className="h-6 w-6 text-yellow-500" />
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Figma to JSX Pro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform your Figma designs into production-ready React components with TypeScript
          </p>
        </div>

        {/* Global Settings */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="typescript">TypeScript</Label>
                  <Switch
                    id="typescript"
                    checked={useTypeScript}
                    onCheckedChange={setUseTypeScript}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="tests">Include Tests</Label>
                  <Switch
                    id="tests"
                    checked={includeTests}
                    onCheckedChange={setIncludeTests}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                v2.1.0
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Figma Export
            </TabsTrigger>
            <TabsTrigger value="css-import" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CSS Import
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="design-tokens" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design Tokens
            </TabsTrigger>
          </TabsList>

          {/* Figma Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Figma className="h-5 w-5 text-purple-600" />
                      Figma API Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="figma-url">Figma File URL</Label>
                      <Input
                        id="figma-url"
                        placeholder="https://www.figma.com/file/..."
                        value={figmaUrl}
                        onChange={(e) => setFigmaUrl(e.target.value)}
                        className={!validateFigmaUrl(figmaUrl) && figmaUrl ? "border-red-300" : ""}
                      />
                      {figmaUrl && !validateFigmaUrl(figmaUrl) && (
                        <p className="text-sm text-red-500">Please enter a valid Figma URL</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="access-token">Personal Access Token</Label>
                      <Input
                        id="access-token"
                        type="password"
                        placeholder="figd_..."
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Get your token from Figma Settings → Account → Personal access tokens
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleFigmaExtract}
                      disabled={!figmaUrl || !accessToken || !validateFigmaUrl(figmaUrl) || isFigmaLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isFigmaLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Zap className="h-4 w-4" />
                          </motion.div>
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Extract Components
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setFigmaUrl("https://www.figma.com/file/example");
                        setAccessToken("figd_example_token");
                        showToast('info', 'Demo Mode', 'Demo data loaded for testing');
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Load Demo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* CSS Import Tab */}
          <TabsContent value="css-import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Figma CSS Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="component-name">Component Name</Label>
                    <Input
                      id="component-name"
                      placeholder="MyComponent"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="css-code">Paste Figma CSS</Label>
                    <Textarea
                      id="css-code"
                      placeholder="Paste your Figma CSS code here..."
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleCssProcess}
                    disabled={!cssCode.trim() || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Code className="h-4 w-4" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Generate Component
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSS Processing Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <h4 className="font-medium">Copy CSS from Figma</h4>
                        <p className="text-sm text-gray-600">Right-click on any element in Figma and select "Copy as CSS"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <h4 className="font-medium">Paste and Name</h4>
                        <p className="text-sm text-gray-600">Paste the CSS code and provide a component name</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <h4 className="font-medium">Generate & Export</h4>
                        <p className="text-sm text-gray-600">Get your React component with Tailwind classes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Sample CSS:</h5>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
{`.button {
  background: #3B82F6;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Components</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadCode(
                    [...SAMPLE_COMPONENTS, ...processedComponents].map(comp => comp.code).join('\n\n'),
                    'figma-components.tsx'
                  )} 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  Export to GitHub
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[...SAMPLE_COMPONENTS, ...processedComponents].map((component) => (
                <Card key={component.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {component.preview}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(component.code)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => downloadCode(component.code, `${component.name}.tsx`)}
                          variant="outline" 
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {component.dependencies.map((dep) => (
                          <Badge key={dep} variant="secondary" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100">
                          <code>{component.code}</code>
                        </pre>
                      </div>
                      {component.styles && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-blue-900 mb-1">Tailwind Classes:</h5>
                          <code className="text-sm text-blue-700">{component.styles}</code>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {[...SAMPLE_COMPONENTS, ...processedComponents].length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-600">No Components Yet</h3>
                    <p className="text-sm text-gray-500">
                      Extract components from Figma or import CSS to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="design-tokens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Design Tokens</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadCode(
                    `export const designTokens = ${JSON.stringify(SAMPLE_DESIGN_TOKENS, null, 2)};`,
                    'design-tokens.ts'
                  )}
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Tokens
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                SAMPLE_DESIGN_TOKENS.reduce((acc, token) => {
                  if (!acc[token.category]) acc[token.category] = [];
                  acc[token.category].push(token);
                  return acc;
                }, {} as Record<string, DesignToken[]>)
              ).map(([category, tokens]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-base">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tokens.map((token) => (
                        <div key={token.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {token.type === 'color' && (
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: token.value }}
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">{token.name}</p>
                              <p className="text-xs text-gray-500">{token.value}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(token.value)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${
                toast.type === 'success' ? 'bg-green-500 text-white' :
                toast.type === 'error' ? 'bg-red-500 text-white' :
                toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' && <CheckCircle className="h-4 w-4" />}
                  {toast.type === 'error' && <AlertTriangle className="h-4 w-4" />}
                  {toast.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                  {toast.type === 'info' && <Info className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{toast.title}</h4>
                  <p className="text-sm opacity-90">{toast.message}</p>
                </div>
                <Button
                  onClick={() => removeToast(toast.id)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1 h-auto"
                >
                  ×
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FigmaConverter;
