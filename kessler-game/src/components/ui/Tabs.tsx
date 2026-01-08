interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-6 bg-slate-800/50 p-3 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-200
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
              }
            `}
            style={{
              boxShadow: activeTab === tab.id
                ? 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)'
                : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
              }
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
            }}
            onMouseUp={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="w-full">
        {activeTabContent}
      </div>
    </div>
  );
}
