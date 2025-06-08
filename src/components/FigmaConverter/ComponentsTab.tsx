
import React from 'react';
import { Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { FigmaComponentCard } from './FigmaComponentCard';

interface ComponentsTabProps {
  extractedData: any;
  handleComponentSelect: (component: any) => void;
}

export const ComponentsTab: React.FC<ComponentsTabProps> = ({
  extractedData,
  handleComponentSelect
}) => {
  return (
    <div className="space-y-4 py-4">
      {extractedData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Exportált komponensek</h3>
            <Badge variant="flat" size="sm">
              {extractedData.components.length} komponens
            </Badge>
          </div>
          
          {extractedData.components.map((component: any) => (
            <FigmaComponentCard
              key={component.id}
              component={component}
              onSelect={handleComponentSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-default-500">
          <Icon icon="lucide:box" className="mx-auto mb-2 w-10 h-10 opacity-50" />
          <p>Még nincsenek exportált komponensek</p>
          <p className="text-sm">Exportálj design-okat a Figma tab-ban</p>
        </div>
      )}
    </div>
  );
};
