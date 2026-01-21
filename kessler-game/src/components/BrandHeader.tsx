import { brand } from '../config/brand';

export function BrandHeader() {
  return (
    <div className="fixed top-4 left-4 z-50 bg-deep-space-200 border border-cyber-cyan-500 rounded px-4 py-2 flex items-center gap-3 shadow-cyber">
      <img 
        src={brand.assets.logo} 
        alt={brand.name} 
        className="h-8 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-cyber-cyan-500 font-bold text-sm">{brand.name}</span>
        <span className="text-gray-400 text-xs">Orbital Management Simulator</span>
      </div>
    </div>
  );
}
