export function OrbitVisualization() {
  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center bg-slate-950">
      {/* GEO orbit */}
      <div className="absolute w-[500px] h-[500px] border-2 border-blue-400/30 rounded-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-xs font-semibold text-blue-400 bg-slate-950/80 px-2 py-1 rounded">
          GEO
        </div>
      </div>
      
      {/* MEO orbit */}
      <div className="absolute w-[350px] h-[350px] border-2 border-blue-400/30 rounded-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-xs font-semibold text-blue-400 bg-slate-950/80 px-2 py-1 rounded">
          MEO
        </div>
      </div>
      
      {/* LEO orbit */}
      <div className="absolute w-[200px] h-[200px] border-2 border-blue-400/30 rounded-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-xs font-semibold text-blue-400 bg-slate-950/80 px-2 py-1 rounded">
          LEO
        </div>
      </div>
      
      {/* Earth */}
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">
        🌍
      </div>
    </div>
  );
}
