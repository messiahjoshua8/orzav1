import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Download,
  Settings,
  LogOut,
  FileText,
  Crown,
  Send,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Plug
} from 'lucide-react';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white h-screen p-6 flex flex-col relative transition-all duration-300 shadow-sm`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
      >
        {isCollapsed ? 
          <ChevronRight className="w-4 h-4 text-gray-600" /> : 
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        }
      </button>

      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'mb-8'}`}>
        <BarChart3 className="text-[#7455EE] w-8 h-8 flex-shrink-0" />
        {!isCollapsed && <span className="ml-2 text-xl font-semibold">hrmind</span>}
      </div>
      
      <nav className="flex-1">
        <div className="space-y-2">
          <a href="#" className={`flex items-center px-4 py-3 text-[#7455EE] bg-[#7455EE]/5 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Dashboard</span>}
          </a>
          <a href="#" className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <Send className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Ask AI</span>}
          </a>
          <a href="#" className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <FileText className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Reports</span>}
          </a>
          <a href="#" className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </a>
          <a href="#" className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Help Center</span>}
          </a>
          <a href="#" className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <Plug className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Integrations</span>}
          </a>
        </div>
      </nav>

      {!isCollapsed && (
        <div className="mt-6 p-4 bg-[#7455EE]/5 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <Crown className="w-5 h-5 text-[#7455EE] flex-shrink-0" />
            <span className="ml-2 font-semibold text-[#7455EE]">Upgrade to Pro</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Get access to advanced analytics, custom reports, and AI-powered insights</p>
          <button className="w-full bg-[#7455EE] text-white py-2 rounded-lg hover:bg-[#7455EE]/90 shadow-sm">
            Upgrade Now
          </button>
        </div>
      )}

      <div className={`mt-6 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-sm">
          M
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-gray-500">CEO</div>
          </div>
        )}
      </div>

      <button className={`mt-6 flex items-center text-gray-600 hover:text-gray-900 ${isCollapsed ? 'justify-center' : ''}`}>
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-2">Logout</span>}
      </button>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Hi, John 👋</h1>
          <p className="text-gray-600">Welcome back to PeakHire</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#7455EE]/20 shadow-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-[#7455EE] text-white rounded-lg hover:bg-[#7455EE]/90 shadow-sm">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Send className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7455EE]" />
        <input
          type="text"
          placeholder="Ask a question about your recruiting data..."
          className="w-full pl-12 pr-24 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7455EE]/20 shadow-sm"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[#7455EE] text-white rounded-lg shadow-sm">
          Ask AI
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Time-to-hire decreasing</h3>
          <p className="text-gray-600 mb-4">Average time-to-hire has decreased by 15% in the last 30 days across all departments.</p>
          <button className="text-[#7455EE] font-medium flex items-center">
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Engineering candidates dropping</h3>
          <p className="text-gray-600 mb-4">Engineering applications down 12% compared to Q1. Recommend adjusting job descriptions.</p>
          <button className="text-[#7455EE] font-medium flex items-center">
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-[#7455EE]" />
            <span className="text-green-500 text-sm">↑ 12%</span>
          </div>
          <h4 className="text-gray-600 mb-1">Active Reports</h4>
          <div className="text-2xl font-semibold">24</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Send className="w-8 h-8 text-[#7455EE]" />
            <span className="text-green-500 text-sm">↑ 8%</span>
          </div>
          <h4 className="text-gray-600 mb-1">AI Queries</h4>
          <div className="text-2xl font-semibold">187</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Plug className="w-8 h-8 text-[#7455EE]" />
            <span className="text-red-500 text-sm">↓ 5%</span>
          </div>
          <h4 className="text-gray-600 mb-1">Active Integrations</h4>
          <div className="text-2xl font-semibold">32</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-[#7455EE]" />
            <span className="text-green-500 text-sm">↑ 15%</span>
          </div>
          <h4 className="text-gray-600 mb-1">Analytics Usage</h4>
          <div className="text-2xl font-semibold">89%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Saved Reports</h3>
          {/* Add saved reports content here */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Analytics Trends</h3>
          {/* Add analytics trends content here */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default App;