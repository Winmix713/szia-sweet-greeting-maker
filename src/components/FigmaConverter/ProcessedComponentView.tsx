import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Chip } from '@heroui/react';
import { Copy, Download, Eye, Code, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ProcessedComponent } from '../../types/figma';

interface ProcessedComponentViewProps {
  component: ProcessedComponent;
  onCopy: (text: string) => void;
  onDownload: (content: string, filename: string) => void;
}

export const ProcessedComponentView: React.FC<ProcessedComponentViewProps> = ({
  component,
  onCopy,
  onDownload
}) => {
  const [selectedViewport, setSelectedViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

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
      name: 'React TypeScript',
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
    },
    {
      name: 'Vue Component',
      extension: '.vue',
      content: `<template>
  <div class="${component.tailwindClasses.main}">
    <slot>{{ componentName }}</slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  componentName?: string;
}

withDefaults(defineProps<Props>(), {
  componentName: '${component.name}'
});
</script>

<style scoped>
${component.styledCss}
</style>`,
      language: 'vue'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Component Stats and Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {component.name} Preview
            </h3>
            <div className="flex gap-2 mt-2">
              <Chip size="sm" color="primary" variant="flat">
                {component.stats.cssRules} CSS Rules
              </Chip>
              <Chip size="sm" color="secondary" variant="flat">
                {component.stats.animations} Animations
              </Chip>
              <Chip size="sm" color="success" variant="flat">
                {component.stats.responsiveBreakpoints} Responsive
              </Chip>
              <Chip size="sm" color="warning" variant="flat">
                {component.stats.customProperties} Variables
              </Chip>
            </div>
          </div>
        </CardHeader>
        
        <CardBody>
          {/* Viewport Selector */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={selectedViewport === 'mobile' ? 'solid' : 'bordered'}
              onPress={() => setSelectedViewport('mobile')}
              startContent={<Smartphone className="w-4 h-4" />}
            >
              Mobile
            </Button>
            <Button
              size="sm"
              variant={selectedViewport === 'tablet' ? 'solid' : 'bordered'}
              onPress={() => setSelectedViewport('tablet')}
              startContent={<Tablet className="w-4 h-4" />}
            >
              Tablet
            </Button>
            <Button
              size="sm"
              variant={selectedViewport === 'desktop' ? 'solid' : 'bordered'}
              onPress={() => setSelectedViewport('desktop')}
              startContent={<Monitor className="w-4 h-4" />}
            >
              Desktop
            </Button>
          </div>

          {/* Live Preview */}
          <div className={`mx-auto transition-all duration-300 ${getViewportClass()}`}>
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 px-3 py-2 border-b text-sm text-gray-600">
                Preview - {selectedViewport}
              </div>
              <div className="p-6 min-h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div 
                  className={component.tailwindClasses.main}
                  style={component.styles ? JSON.parse(JSON.stringify(component.styles)) : {}}
                >
                  {component.name} Component
                </div>
              </div>
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
        </CardBody>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Options
          </h3>
        </CardHeader>
        <CardBody>
          <Tabs defaultSelectedKey="react">
            <Tab key="react" title="React TypeScript">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">React TypeScript Component</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onCopy(exportFormats[0].content)}
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onDownload(exportFormats[0].content, `${component.name}${exportFormats[0].extension}`)}
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{exportFormats[0].content}</code>
                </pre>
              </div>
            </Tab>

            <Tab key="css" title="Pure CSS">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Pure CSS Styles</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onCopy(exportFormats[1].content)}
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onDownload(exportFormats[1].content, `${component.name}${exportFormats[1].extension}`)}
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{exportFormats[1].content}</code>
                </pre>
              </div>
            </Tab>

            <Tab key="html" title="HTML">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Complete HTML Structure</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onCopy(exportFormats[2].content)}
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onDownload(exportFormats[2].content, `${component.name}${exportFormats[2].extension}`)}
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{exportFormats[2].content}</code>
                </pre>
              </div>
            </Tab>

            <Tab key="vue" title="Vue Component">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Vue 3 Component</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onCopy(exportFormats[4].content)}
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onDownload(exportFormats[4].content, `${component.name}${exportFormats[4].extension}`)}
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{exportFormats[4].content}</code>
                </pre>
              </div>
            </Tab>

            <Tab key="tailwind" title="Tailwind">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tailwind CSS Classes</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onCopy(exportFormats[3].content)}
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => onDownload(exportFormats[3].content, `${component.name}${exportFormats[3].extension}`)}
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{exportFormats[3].content}</code>
                </pre>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Component Props Interface */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Code className="w-5 h-5" />
            TypeScript Interface
          </h3>
        </CardHeader>
        <CardBody>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
            <code>{component.props}</code>
          </pre>
          <div className="mt-3 flex gap-2">
            <Button
              variant="bordered"
              size="sm"
              onPress={() => onCopy(component.props)}
              startContent={<Copy className="w-4 h-4" />}
            >
              Copy Interface
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};