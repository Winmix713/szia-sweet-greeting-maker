import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Download, Copy, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ProcessedComponent } from '@/types/figma';

interface ComponentPreviewProps {
  component: ProcessedComponent;
  onCopy: (text: string) => void;
  onDownload: (content: string, filename: string) => void;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  component,
  onCopy,
  onDownload
}) => {
  const [selectedViewport, setSelectedViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewHTML, setPreviewHTML] = useState('');

  useEffect(() => {
    // Generate preview HTML from component
    const generatePreviewHTML = () => {
      const baseStyles = `
        <style>
          .preview-container {
            padding: 2rem;
            background: #f8fafc;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .component-preview {
            ${component.styles}
          }
          @media (max-width: 768px) {
            .component-preview {
              font-size: 14px;
              padding: 8px 16px;
            }
          }
        </style>
      `;

      const html = `
        ${baseStyles}
        <div class="preview-container">
          <div class="component-preview ${component.tailwindClasses.main}">
            ${component.name} Component Preview
          </div>
        </div>
      `;

      return html;
    };

    setPreviewHTML(generatePreviewHTML());
  }, [component]);

  const getViewportClass = () => {
    switch (selectedViewport) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'w-full';
    }
  };

  const exportFormats = [
    {
      name: 'React Component',
      extension: '.tsx',
      content: component.reactCode,
      language: 'typescript'
    },
    {
      name: 'Pure CSS',
      extension: '.css',
      content: component.styledCss,
      language: 'css'
    },
    {
      name: 'HTML Structure',
      extension: '.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${component.name} Component</title>
  <style>
    ${component.styledCss}
  </style>
</head>
<body>
  ${component.htmlStructure}
</body>
</html>`,
      language: 'html'
    },
    {
      name: 'Tailwind Classes',
      extension: '.txt',
      content: component.tailwindClasses.customStyles.join(' '),
      language: 'text'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Component Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {component.name} Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">
              {component.stats.cssRules} CSS Rules
            </Badge>
            <Badge variant="secondary">
              {component.stats.responsiveBreakpoints} Responsive Breakpoints
            </Badge>
            <Badge variant="secondary">
              {component.stats.animations} Animations
            </Badge>
            <Badge variant="secondary">
              {component.stats.customProperties} Custom Properties
            </Badge>
          </div>

          {/* Viewport Selector */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedViewport === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedViewport('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
            <Button
              variant={selectedViewport === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedViewport('tablet')}
            >
              <Tablet className="w-4 h-4 mr-1" />
              Tablet
            </Button>
            <Button
              variant={selectedViewport === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedViewport('desktop')}
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
            </Button>
          </div>

          {/* Live Preview */}
          <div className={`mx-auto transition-all duration-300 ${getViewportClass()}`}>
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 px-3 py-2 border-b text-sm text-gray-600">
                Preview - {selectedViewport}
              </div>
              <div 
                className="p-6 min-h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            </div>
          </div>

          {/* Interactive Example */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Interactive Example</h4>
            <div className="space-y-2">
              <button
                className={component.tailwindClasses.main}
                style={component.styles ? JSON.parse(JSON.stringify(component.styles)) : {}}
                onClick={() => alert('Component clicked!')}
              >
                Click me - {component.name}
              </button>
              <p className="text-sm text-gray-600">
                This is a live, interactive version of your component using the generated styles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="react" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            </TabsList>

            {exportFormats.map((format, index) => (
              <TabsContent key={index} value={format.name.toLowerCase().split(' ')[0]} className="mt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{format.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCopy(format.content)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(format.content, `${component.name}${format.extension}`)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                      <code>{format.content}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Component Props Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            TypeScript Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
            <code>{component.props}</code>
          </pre>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(component.props)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Interface
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};