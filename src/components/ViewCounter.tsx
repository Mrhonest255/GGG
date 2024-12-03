import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export function ViewCounter() {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Simulate random viewer count changes
    const interval = setInterval(() => {
      setViewCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-gray-300">
      <Users size={20} className="text-blue-400" />
      <span>{viewCount.toLocaleString()} viewers</span>
    </div>
  );
}