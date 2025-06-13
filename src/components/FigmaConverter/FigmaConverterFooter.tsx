
import React from 'react';
import { CardFooter, Button } from '@heroui/react';
import { HelpCircle, Settings } from 'lucide-react';

export const FigmaConverterFooter: React.FC = () => {
  return (
    <CardFooter className="flex justify-between items-center px-4 py-3 border-t">
      <div className="text-xs text-default-500">
        Figma to JSX Pro v0.2.0
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="light"
          startContent={<HelpCircle width={14} />}
        >
          Súgó
        </Button>
        <Button
          size="sm"
          color="primary"
          startContent={<Settings width={14} />}
        >
          Beállítások
        </Button>
      </div>
    </CardFooter>
  );
};
