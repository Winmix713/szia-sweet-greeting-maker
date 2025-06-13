
import { FigmaConverter } from '@/components/FigmaConverter/FigmaConverter';
import { Navigation } from '@/components/ui/navigation';

const Index = () => {
  const handleSvgExtracted = (svg: string, metadata: any) => {
    console.log('SVG extracted:', { svg, metadata });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <FigmaConverter onSvgExtracted={handleSvgExtracted} />
        </div>
      </div>
    </>
  );
};

export default Index;
