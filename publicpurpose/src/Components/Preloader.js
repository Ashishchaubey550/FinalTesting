import { useEffect, useState } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <div className="text-center">
        {/* Animated ValueDrive text */}
        <div className="flex justify-center mb-6">
          <span className="text-5xl font-bold text-gray-800 dark:text-white">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>V</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>A</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>L</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>U</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>E</span>
            <span className="inline-block ml-4 text-red-500 dark:text-red-300 animate-pulse">D</span>
            <span className="inline-block text-red-500 dark:text-red-300 animate-pulse" style={{ animationDelay: '0.1s' }}>R</span>
            <span className="inline-block text-red-500 dark:text-red-300 animate-pulse" style={{ animationDelay: '0.2s' }}>I</span>
            <span className="inline-block text-red-400 dark:text-red-300 animate-pulse" style={{ animationDelay: '0.3s' }}>V</span>
            <span className="inline-block text-red-400 dark:text-red-300 animate-pulse" style={{ animationDelay: '0.4s' }}>E</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-200 rounded-full overflow-hidden mx-auto mb-6">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;