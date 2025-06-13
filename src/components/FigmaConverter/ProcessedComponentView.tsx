
import React from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Chip } from '@heroui/react';
import { Copy, Download } from 'lucide-react';
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
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{component.name}</h3>
          <div className="flex gap-2 mt-1">
            <Chip size="sm" color="primary" variant="flat">
              {component.stats.cssRules} CSS szabály
            </Chip>
            <Chip size="sm" color="secondary" variant="flat">
              {component.stats.animations} animáció
            </Chip>
            <Chip size="sm" color="success" variant="flat">
              {component.tailwindClasses.main.split(' ').length} Tailwind osztály
            </Chip>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            startContent={<Copy width={16} />}
            onPress={() => onCopy(component.reactCode)}
          >
            Másolás
          </Button>
          <Button
            size="sm"
            color="primary"
            startContent={<Download width={16} />}
            onPress={() => onDownload(component.reactCode, `${component.name}.tsx`)}
          >
            Letöltés
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        <Tabs aria-label="Component code">
          <Tab key="react" title="React komponens">
            <Card className="mt-4">
              <CardBody>
                <pre className="text-sm bg-default-100 p-4 rounded overflow-auto">
                  <code className="language-typescript">{component.reactCode}</code>
                </pre>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="tailwind" title="Tailwind osztályok">
            <div className="mt-4 space-y-4">
              <Card>
                <CardBody>
                  <h4 className="font-medium mb-2">Fő osztályok:</h4>
                  <div className="bg-default-100 p-3 rounded">
                    <code className="text-sm">{component.tailwindClasses.main}</code>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <h4 className="font-medium mb-2">HTML struktúra:</h4>
                  <pre className="text-sm bg-default-100 p-3 rounded overflow-auto">
                    <code>{component.htmlStructure}</code>
                  </pre>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="css" title="Eredeti CSS">
            <Card className="mt-4">
              <CardBody>
                <pre className="text-sm bg-default-100 p-4 rounded overflow-auto">
                  <code className="language-css">{component.originalCss}</code>
                </pre>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="styled" title="Styled CSS">
            <Card className="mt-4">
              <CardBody>
                <pre className="text-sm bg-default-100 p-4 rounded overflow-auto">
                  <code className="language-css">{component.styledCss}</code>
                </pre>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};
