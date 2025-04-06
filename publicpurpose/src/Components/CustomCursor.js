import { useEffect, useState } from 'react';

const CustomCursor = ({
  normalSize = 20,        // Default normal size in pixels
  pointerSize = 60,      // Size when hovering clickable elements
  clickSize = 10,        // Size during click
  normalColor = '#ef4444',       // Default red-500
  pointerColor = '#f87171',      // Lighter red-400
  clickColor = '#dc2626',        // Darker red-600
  transitionSpeed = 0.3, // Transition duration in seconds
  elasticEffect = 'cubic-bezier(0.18, 0.89, 0.32, 1.28)' // Elastic curve
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.hasAttribute('data-clickable')
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        mixBlendMode: 'exclusion',
        willChange: 'transform',
        transform: 'translate(-50%, -50%)',
        transition: `
          transform ${isClicking ? '0.1s' : `${transitionSpeed}s`} ${elasticEffect},
          width ${transitionSpeed}s ${elasticEffect},
          height ${transitionSpeed}s ${elasticEffect},
          background 0.2s ease-out,
          opacity 0.2s ease-out
        `,
        width: isClicking ? `${clickSize}px` : isPointer ? `${pointerSize}px` : `${normalSize}px`,
        height: isClicking ? `${clickSize}px` : isPointer ? `${pointerSize}px` : `${normalSize}px`,
        backgroundColor: isClicking ? clickColor : isPointer ? pointerColor : normalColor,
        opacity: isVisible ? 1 : 0
      }}
    />
  );
};

export default CustomCursor;