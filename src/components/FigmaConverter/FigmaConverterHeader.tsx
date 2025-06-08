
import React from 'react';
import { CardHeader, Badge } from '@heroui/react';

export const FigmaConverterHeader: React.FC = () => {
  return (
    <CardHeader className="flex flex-row items-center gap-2 pb-2">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white text-sm font-bold">
        F
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Figma to JSX Pro</h2>
          <Badge color="secondary" size="sm" className="h-5">BETA</Badge>
        </div>
        <p className="text-xs text-default-500">Figma design to React component converter</p>
      </div>
    </CardHeader>
  );
};
