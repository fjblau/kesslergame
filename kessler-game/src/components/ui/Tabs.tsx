import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6 bg-slate-800/50 p-2 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors duration-200
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
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
