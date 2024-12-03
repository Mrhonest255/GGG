import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Chat } from './components/Chat';
import { ViewCounter } from './components/ViewCounter';
import { Menu, X } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">StreamHub</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:text-blue-400"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="space-y-6">
              <VideoPlayer
                title="Live Stream"
                isLive={true}
                // Use a legal streaming URL here
                streamUrl="https://exm3u.123tv.to:8080/PsV8ILRBYZ/XVPZxk62WC/105380" />
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Live Stream Title</h2>
                  <ViewCounter />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Follow
                  </button>
                  <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                    Share
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`lg:w-96 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;