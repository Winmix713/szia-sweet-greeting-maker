
import React from 'react';
import { Card, CardBody, CardFooter, Button, Badge, Chip } from '@heroui/react';
import { Box, Download } from 'lucide-react';
import { FigmaComponent } from '../../types/figma';

interface FigmaComponentCardProps {
  component: FigmaComponent;
  onSelect: (component: FigmaComponent) => void;
}

export const FigmaComponentCard: React.FC<FigmaComponentCardProps> = ({ component, onSelect }) => {
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-lg">{component.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge size="sm" variant="flat" color="primary">
                {component.type}
              </Badge>
              <Chip size="sm" variant="flat">
                {Object.keys(component.styles).length} CSS tulajdonság
              </Chip>
            </div>
          </div>
          <Box className="w-8 h-8 text-default-400" />
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-sm text-default-600">Főbb stílusok:</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(component.styles).slice(0, 6).map(([prop, value]) => (
              <div key={prop} className="bg-default-100 p-2 rounded">
                <span className="font-mono text-purple-600">{prop}:</span>
                <span className="ml-1 text-default-700">{value}</span>
              </div>
            ))}
            {Object.keys(component.styles).length > 6 && (
              <div className="text-default-500 text-center py-2">
                +{Object.keys(component.styles).length - 6} további...
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-4 pb-4">
        <Button
          color="primary"
          variant="flat"
          onPress={() => onSelect(component)}
          startContent={<Download width={16} />}
          className="w-full"
        >
          Komponens betöltése
        </Button>
      </CardFooter>
    </Card>
  );
};
