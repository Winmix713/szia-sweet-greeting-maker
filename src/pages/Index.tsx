
import { FigmaConverter } from '@/components/FigmaConverter/FigmaConverter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Index = () => {
  const handleSvgExtracted = (svg: string, metadata: any) => {
    console.log('SVG extracted:', { svg, metadata });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-end">
          <Link to="/figma-pro">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Try Pro Version
            </Button>
          </Link>
        </div>
        <FigmaConverter onSvgExtracted={handleSvgExtracted} />
      </div>
    </div>
  );
};

export default Index;
