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
      <div className="flex gap-2 mb-6 bg-deep-space-300 p-2 border-2 border-deep-space-50 shadow-depth">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-3 font-semibold text-lg transition-all duration-200 border-2
              ${activeTab === tab.id 
                ? 'bg-cyber-cyan-600 text-deep-space-500 border-cyber-cyan-400 shadow-cyber' 
                : 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-cyber-cyan-900 hover:text-white hover:border-cyber-cyan-600 shadow-depth'
              }
            `}
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
