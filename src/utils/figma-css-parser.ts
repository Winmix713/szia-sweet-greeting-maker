
export const extractComponentNameFromCss = (css: string): string => {
  // Try to extract name from comments
  const commentMatch = css.match(/\/\*\s*([^*]+)\s*\*\//);
  if (commentMatch) {
    const name = commentMatch[1].trim();
    if (!name.includes('Auto layout') && name.length < 50) {
      return name.replace(/[^a-zA-Z0-9]/g, '');
    }
  }

  // Try to extract from class names
  const classMatch = css.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/);
  if (classMatch) {
    return classMatch[1].replace(/[-_]/g, '');
  }

  return 'Component';
};

export const parseFigmaCssBlocks = (css: string): string[] => {
  const blocks: string[] = [];
  const lines = css.split('\n');
  let currentBlock = '';
  let braceCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    currentBlock += line + '\n';
    
    for (const char of trimmedLine) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }

    if (braceCount === 0 && currentBlock.includes('{')) {
      blocks.push(currentBlock.trim());
      currentBlock = '';
    }
  }

  return blocks.filter(block => block.length > 0);
};

export const extractDeclarationsFromBlock = (block: string): Record<string, string> => {
  const declarations: Record<string, string> = {};
  const lines = block.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes(':') && !trimmedLine.includes('{') && !trimmedLine.includes('}')) {
      const colonIndex = trimmedLine.indexOf(':');
      const property = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).replace(';', '').trim();
      
      if (property && value) {
        declarations[property] = value;
      }
    }
  }

  return declarations;
};

export const convertCssToTailwind = (declarations: Record<string, string>): string[] => {
  const tailwindClasses: string[] = [];

  Object.entries(declarations).forEach(([property, value]) => {
    switch (property) {
      case 'display':
        if (value === 'flex') tailwindClasses.push('flex');
        if (value === 'block') tailwindClasses.push('block');
        if (value === 'inline') tailwindClasses.push('inline');
        break;
      case 'flex-direction':
        if (value === 'column') tailwindClasses.push('flex-col');
        if (value === 'row') tailwindClasses.push('flex-row');
        break;
      case 'justify-content':
        if (value === 'center') tailwindClasses.push('justify-center');
        if (value === 'space-between') tailwindClasses.push('justify-between');
        if (value === 'flex-start') tailwindClasses.push('justify-start');
        if (value === 'flex-end') tailwindClasses.push('justify-end');
        break;
      case 'align-items':
        if (value === 'center') tailwindClasses.push('items-center');
        if (value === 'flex-start') tailwindClasses.push('items-start');
        if (value === 'flex-end') tailwindClasses.push('items-end');
        break;
      case 'padding':
        const paddingMatch = value.match(/(\d+)px/);
        if (paddingMatch) {
          const px = parseInt(paddingMatch[1]);
          if (px <= 4) tailwindClasses.push('p-1');
          else if (px <= 8) tailwindClasses.push('p-2');
          else if (px <= 12) tailwindClasses.push('p-3');
          else if (px <= 16) tailwindClasses.push('p-4');
          else if (px <= 24) tailwindClasses.push('p-6');
          else tailwindClasses.push('p-8');
        }
        break;
      case 'margin':
        const marginMatch = value.match(/(\d+)px/);
        if (marginMatch) {
          const px = parseInt(marginMatch[1]);
          if (px <= 4) tailwindClasses.push('m-1');
          else if (px <= 8) tailwindClasses.push('m-2');
          else if (px <= 12) tailwindClasses.push('m-3');
          else if (px <= 16) tailwindClasses.push('m-4');
          else if (px <= 24) tailwindClasses.push('m-6');
          else tailwindClasses.push('m-8');
        }
        break;
      case 'border-radius':
        const radiusMatch = value.match(/(\d+)px/);
        if (radiusMatch) {
          const px = parseInt(radiusMatch[1]);
          if (px <= 2) tailwindClasses.push('rounded-sm');
          else if (px <= 4) tailwindClasses.push('rounded');
          else if (px <= 8) tailwindClasses.push('rounded-md');
          else if (px <= 12) tailwindClasses.push('rounded-lg');
          else tailwindClasses.push('rounded-xl');
        }
        break;
      case 'background-color':
        if (value === '#ffffff' || value === 'white') tailwindClasses.push('bg-white');
        else if (value === '#000000' || value === 'black') tailwindClasses.push('bg-black');
        else tailwindClasses.push('bg-gray-100');
        break;
      case 'color':
        if (value === '#ffffff' || value === 'white') tailwindClasses.push('text-white');
        else if (value === '#000000' || value === 'black') tailwindClasses.push('text-black');
        else tailwindClasses.push('text-gray-900');
        break;
    }
  });

  return tailwindClasses;
};
