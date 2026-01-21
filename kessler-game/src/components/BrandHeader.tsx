import { brand } from '../config/brand';

export function BrandHeader() {
  return (
    <div className="bg-deep-space-200/95 backdrop-blur-sm border border-cyber-cyan-500/50 rounded px-6 py-3 flex items-center gap-4 shadow-cyber mb-6">
      <img 
        src={brand.assets.logo} 
        alt={brand.name} 
        className="h-10 object-contain brightness-0 invert"
      />
      <div className="flex flex-col">
        <span className="text-white font-semibold text-base">{brand.name}</span>
        <span className="text-gray-300 text-xs">Orbital Management Simulator</span>
      </div>
    </div>
  );
}
