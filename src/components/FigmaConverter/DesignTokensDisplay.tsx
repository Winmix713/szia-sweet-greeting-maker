
import React from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Design Tokenek</h3>
        <Button
          size="sm"
          variant="flat"
          startContent={<Icon icon="lucide:copy" width={16} />}
          onPress={() => onCopy(generatedTokensCode)}
        >
          Kód másolása
        </Button>
      </div>

      <Tabs aria-label="Design tokens">
        <Tab key="colors" title="Színek">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {Object.entries(designTokens.colors || {}).map(([name, color]) => (
              <Card key={name} className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="font-medium text-sm">{name}</p>
                    <p className="text-xs text-default-500 font-mono">{color}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab key="typography" title="Tipográfia">
          <div className="space-y-3 mt-4">
            {Object.entries(designTokens.typography || {}).map(([name, styles]) => (
              <Card key={name} className="p-4">
                <h4 className="font-medium mb-2">{name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(styles as Record<string, string>).map(([prop, value]) => (
                    <div key={prop}>
                      <span className="text-default-600">{prop}:</span>
                      <span className="ml-1 font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab key="spacing" title="Térközök">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {Object.entries(designTokens.spacing || {}).map(([name, value]) => (
              <Card key={name} className="p-3">
                <div className="text-center">
                  <div
                    className="bg-primary mx-auto mb-2"
                    style={{ width: value, height: '8px' }}
                  />
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-default-500 font-mono">{value}</p>
                </div>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab key="code" title="Exportált kód">
          <Card className="mt-4">
            <CardBody>
              <pre className="text-sm bg-default-100 p-4 rounded overflow-auto">
                <code>{generatedTokensCode}</code>
              </pre>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
