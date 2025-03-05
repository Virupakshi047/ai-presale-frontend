"use client";

import { useState } from 'react';
import RequirementAnalyzer from '../features/RequirementAnalyzer';

export default function MainBody() {
  const [activeTab, setActiveTab] = useState('requirementAnalysis');
  const tabs = [
    { id: 'requirementAnalysis', label: 'Requirement Analysis' },
    { id: 'feature1', label: 'Feature 1' },
    { id: 'feature2', label: 'Feature 2' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Project name</h1>
      
      <div className="mb-4 border-b">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'requirementAnalysis' && <RequirementAnalyzer />}
        {/* Placeholder for other feature tabs */}
        {activeTab === 'feature1' && <div>Feature 1 Content</div>}
        {activeTab === 'feature2' && <div>Feature 2 Content</div>}
      </div>
    </div>
  );
}