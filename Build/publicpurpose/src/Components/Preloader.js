import { useEffect, useState, useRef } from 'react';

const Preloader = ({ contentLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    // Start progress animation
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          // Check if content has already loaded
          if (contentLoaded) setLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [contentLoaded]);

  useEffect(() => {
    if (contentLoaded) {
      // Clear existing interval and fast-forward progress
      clearInterval(intervalRef.current);
      setProgress(100);
      
      // Hide preloader after short transition
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500); // Matches CSS transition duration

      return () => clearTimeout(timeout);
    }
  }, [contentLoaded]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-all duration-500">
      <div className="text-center">
        {/* Animated ValueDrive text */}
        <div className="flex justify-center mb-6">
          <span className="text-5xl font-bold text-gray-800 dark:text-white">
            {['V', 'A', 'L', 'U', 'E'].map((letter, i) => (
              <span 
                key={i}
                className="inline-block animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
            <span className="ml-4">
              {['D', 'R', 'I', 'V', 'E'].map((letter, i) => (
                <span
                  key={i}
                  className={`inline-block ${
                    i < 2 ? 'text-red-500' : 'text-red-400'
                  } dark:text-red-300 animate-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto mb-6">
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