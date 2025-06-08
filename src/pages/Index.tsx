
import { FigmaConverter } from '@/components/FigmaConverter/FigmaConverter';

const Index = () => {
  const handleSvgExtracted = (svg: string, metadata: any) => {
    console.log('SVG extracted:', { svg, metadata });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <FigmaConverter onSvgExtracted={handleSvgExtracted} />
      </div>
    </div>
  );
};

export default Index;
