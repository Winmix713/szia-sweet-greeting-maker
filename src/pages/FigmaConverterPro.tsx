import { FigmaConverterPro } from '@/components/ui/figma-converter-pro';

const FigmaConverterProPage = () => {
  const handleSvgExtracted = (svg: string, metadata: any) => {
    console.log('SVG extracted:', { svg, metadata });
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] p-4">
      <div className="max-w-6xl mx-auto">
        <FigmaConverterPro onSvgExtracted={handleSvgExtracted} />
      </div>
    </div>
  );
};

export default FigmaConverterProPage;