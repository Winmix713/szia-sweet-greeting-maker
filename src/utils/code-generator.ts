
import { ProcessedComponent } from '../types/figma';

export const generateReactComponentFromCss = (
  componentName: string,
  tailwindClasses: string[],
  declarations: Record<string, string>
): ProcessedComponent => {
  const propsInterface = `interface ${componentName}Props {
  children?: React.ReactNode;
  className?: string;
}`;

  const classNames = tailwindClasses.join(' ');
  
  const componentCode = `import React from 'react';
import { cn } from '@/lib/utils';

${propsInterface}

const ${componentName} = ({ children, className }: ${componentName}Props) => {
  return (
    <div className={cn("${classNames}", className)}>
      {children}
    </div>
  );
};

export default ${componentName};`;

  const originalCss = Object.entries(declarations)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');

  const styledCss = `.${componentName.toLowerCase()} {\n${originalCss}\n}`;

  const htmlStructure = `<div class="${classNames}">
  <!-- Component content -->
</div>`;

  return {
    name: componentName,
    code: componentCode,
    props: propsInterface,
    styles: classNames,
    originalCss: originalCss,
    reactCode: componentCode,
    styledCss: styledCss,
    htmlStructure: htmlStructure,
    tailwindClasses: {
      main: classNames,
      customStyles: tailwindClasses.filter(cls => cls.includes('[') && cls.includes(']'))
    },
    stats: {
      cssRules: Object.keys(declarations).length,
      responsiveBreakpoints: tailwindClasses.filter(cls => cls.includes('sm:') || cls.includes('md:') || cls.includes('lg:') || cls.includes('xl:')).length,
      animations: tailwindClasses.filter(cls => cls.includes('animate-')).length,
      customProperties: tailwindClasses.filter(cls => cls.includes('[') && cls.includes(']')).length
    }
  };
};

export const generateJsxFromFigmaStructure = (data: any): string => {
  // This is a simplified JSX structure generator
  // In a real implementation, this would analyze the Figma structure more deeply
  return `<div className="flex flex-col gap-4 p-4">
  <h1 className="text-2xl font-bold">Generated Component</h1>
  <p className="text-gray-600">This is a generated component from Figma design.</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
    Action Button
  </button>
</div>`;
};
