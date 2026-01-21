import { brand } from '../config/brand';
import { ScoreDisplay } from './Score/ScoreDisplay';

export function BrandHeader() {
  return (
    <header className="bg-deep-space-200/95 backdrop-blur-sm border border-cyber-cyan-500/50 rounded px-6 py-4 shadow-cyber mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img 
            src={brand.assets.logo} 
            alt={brand.name} 
            className="h-12 object-contain brightness-0 invert"
          />
          <h1 className="text-4xl font-bold text-cyber-cyan-500" style={{ textShadow: '0 0 15px rgba(0, 217, 255, 0.4)' }}>
            {brand.text.appName}
          </h1>
        </div>
        <ScoreDisplay />
      </div>
    </header>
  );
}
