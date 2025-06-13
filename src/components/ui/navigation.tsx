import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Figma, Code, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10">
        <Link href="/">
          <Button
            variant={location === '/' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "text-white/80 hover:text-white",
              location === '/' && "bg-white/10 text-white"
            )}
          >
            <Code className="w-4 h-4 mr-2" />
            Original
          </Button>
        </Link>
        
        <ArrowRight className="w-4 h-4 text-white/40" />
        
        <Link href="/figma-pro">
          <Button
            variant={location === '/figma-pro' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "text-white/80 hover:text-white relative",
              location === '/figma-pro' && "bg-white/10 text-white"
            )}
          >
            <Figma className="w-4 h-4 mr-2" />
            Pro Version
            <Badge 
              variant="secondary" 
              className="ml-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 text-xs"
            >
              NEW
            </Badge>
          </Button>
        </Link>
      </div>
    </nav>
  );
};