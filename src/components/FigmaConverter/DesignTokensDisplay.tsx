import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab } from '@heroui/react';
import { Copy, Palette, Type, Download } from 'lucide-react';
import { DesignTokens } from '../../types/figma';

interface DesignTokensDisplayProps {
  designTokens: DesignTokens;
  generatedTokensCode: string;
  onCopy: (text: string) => void;
}

export const DesignTokensDisplay: React.FC<DesignTokensDisplayProps> = ({
  designTokens,
  generatedTokensCode,
  onCopy
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const formatTokensAsCSS = () => {
    let css = ':root {\n';
    
    // Colors
    Object.entries(designTokens.colors).forEach(([name, value]) => {
      css += `  --color-${name}: ${value};\n`;
    });
    
    // Typography
    Object.entries(designTokens.typography).forEach(([name, styles]) => {
      if (typeof styles === 'object') {
        Object.entries(styles).forEach(([prop, val]) => {
          css += `  --font-${name}-${prop}: ${val};\n`;
        });
      }
    });
    
    // Spacing
    Object.entries(designTokens.spacing).forEach(([name, value]) => {
      css += `  --spacing-${name}: ${value};\n`;
    });
    
    css += '}';
    return css;
  };

  const formatTokensAsJS = () => {
    return `export const designTokens = ${JSON.stringify(designTokens, null, 2)};`;
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const l1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
    const l2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Design Tokens</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{Object.keys(designTokens.colors).length} colors</span>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{Object.keys(designTokens.typography).length} typography</span>
          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{Object.keys(designTokens.spacing).length} spacing</span>
        </CardHeader>
        <CardBody>
          <Tabs defaultSelectedKey="preview">
            <Tab key="preview" title="Preview">
              <div className="space-y-8">
                {/* Enhanced Color Palette */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Palette
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(designTokens.colors).map(([name, value]) => (
                      <Card 
                        key={name} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedColor === name ? 'ring-2 ring-blue-500' : ''
                        }`}
                        isPressable
                        onPress={() => setSelectedColor(selectedColor === name ? null : name)}
                      >
                        <CardBody className="p-4">
                          <div 
                            className="w-full h-20 rounded-lg border shadow-sm mb-3 flex items-center justify-center"
                            style={{ backgroundColor: value }}
                          >
                            <div className="text-white text-xs font-medium drop-shadow-md">
                              {name}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium capitalize">{name}</div>
                            <div className="text-sm text-gray-600 font-mono">{value}</div>
                            <div className="text-xs text-gray-500">
                              Contrast: {getContrastRatio(value, '#ffffff')}:1
                            </div>
                          </div>
                          {selectedColor === name && (
                            <div className="mt-3 space-y-2">
                              <Button
                                size="sm"
                                variant="bordered"
                                onPress={() => onCopy(value)}
                                startContent={<Copy className="w-3 h-3" />}
                              >
                                Copy Hex
                              </Button>
                              <div className="text-xs text-gray-500">
                                RGB: {parseInt(value.slice(1,3), 16)}, {parseInt(value.slice(3,5), 16)}, {parseInt(value.slice(5,7), 16)}
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Enhanced Typography */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Typography System
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(designTokens.typography).map(([name, styles]) => (
                      <Card key={name}>
                        <CardBody className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-gray-500 mb-2 font-medium">{name}</div>
                              <div 
                                style={typeof styles === 'object' ? styles : {}}
                                className="mb-3"
                              >
                                The quick brown fox jumps over the lazy dog
                              </div>
                              <div className="text-xs text-gray-400">
                                {typeof styles === 'object' ? 
                                  Object.entries(styles).map(([prop, val]) => `${prop}: ${val}`).join(' • ') 
                                  : styles
                                }
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div 
                                style={typeof styles === 'object' ? styles : {}}
                                className="text-2xl"
                              >
                                Aa
                              </div>
                              <Button
                                variant="bordered"
                                size="sm"
                                onPress={() => onCopy(typeof styles === 'object' ? JSON.stringify(styles) : styles)}
                                startContent={<Copy className="w-3 h-3" />}
                              >
                                Copy Styles
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Enhanced Spacing */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Spacing Scale
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(designTokens.spacing).map(([name, value]) => (
                      <Card key={name} className="p-4 text-center">
                        <CardBody>
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">{name}</div>
                            <div className="flex justify-center">
                              <div 
                                className="bg-blue-500 rounded"
                                style={{ 
                                  width: value, 
                                  height: value, 
                                  minWidth: '4px', 
                                  minHeight: '4px',
                                  maxWidth: '48px',
                                  maxHeight: '48px' 
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mb-2">{value}</div>
                          <Button
                            variant="light"
                            size="sm"
                            onPress={() => onCopy(value)}
                          >
                            Copy
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="css" title="CSS">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">CSS Custom Properties</h4>
                  <Button
                    variant="bordered"
                    size="sm"
                    onPress={() => onCopy(formatTokensAsCSS())}
                    startContent={<Copy className="w-4 h-4" />}
                  >
                    Copy CSS
                  </Button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  <code>{formatTokensAsCSS()}</code>
                </pre>
              </div>
            </Tab>

            <Tab key="js" title="JavaScript">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">JavaScript Object</h4>
                  <Button
                    variant="bordered"
                    size="sm"
                    onPress={() => onCopy(formatTokensAsJS())}
                    startContent={<Copy className="w-4 h-4" />}
                  >
                    Copy JS
                  </Button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  <code>{formatTokensAsJS()}</code>
                </pre>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};