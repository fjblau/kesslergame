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
      <div className="flex gap-2 mb-6 bg-deep-space-300 p-2 border-2 border-deep-space-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-3 font-semibold text-lg transition-all duration-200 border-2
              ${activeTab === tab.id 
                ? 'bg-cyber-cyan-600 text-deep-space-500 border-cyber-cyan-400' 
                : 'bg-deep-space-100 text-gray-300 border-deep-space-50 hover:bg-deep-space-50 hover:text-white hover:border-cyber-cyan-700'
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
