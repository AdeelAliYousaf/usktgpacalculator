import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AniLink from './TransitionalLink';

const BottomMenu = () => {
  const location = useLocation();
  const [isVertical, setIsVertical] = useState(window.innerWidth >= 1024);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth >= 1024);
      if (window.innerWidth < 1024) setIsMenuVisible(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMenuVisible((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Slider Button */}
      {isVertical && (
        <button
          className="fixed top-1/2 left-0 z-50 p-[0.85rem] text-white bg-gray-900 font-bold rounded-r-full transform -translate-y-1/2"
          onClick={toggleMenu}
        >
          {isMenuVisible ? 'Close' : 'Menu'}
        </button>
      )}

      {/* Bottom/Side Menu */}
      <div
        className={`bottom-menu fixed ${
          isVertical
            ? `top-0 bottom-0 ${isMenuVisible ? 'left-0' : '-left-16'} w-16 transition-all duration-300`
            : 'bottom-0 left-0 w-full py-4'
        } text-white flex ${
          isVertical ? 'flex-col justify-between' : 'justify-around'
        } py-3 backdrop-blur-[2px] rounded-t-3xl lg:rounded-r-3xl bg-[#333d3421]`}
      >
        {/* GPA Calculator (Calculator Icon) */}
        <AniLink to="/" className={`menu-link ${isActive('/') ? 'active' : ''}`}>
          <svg 
            className="w-8 h-8 md:w-10 md:h-10" 
            viewBox="0 0 24 24" 
            fill={isActive('/') || isActive('/suggest') ? '#0EF6CC' : '#aaa'} 
            xmlns="http://www.w3.org/2000/svg">

            <path d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z" stroke="#1C274D" stroke-width="1.5"/>
            <path d="M18 8.49998H14M18 14.5H14M18 17.5H14M10 8.49999H8M8 8.49999L6 8.49999M8 8.49999L8 6.49998M8 8.49999L8 10.5M9.5 14.5L8.00001 16M8.00001 16L6.50001 17.5M8.00001 16L6.5 14.5M8.00001 16L9.49999 17.5" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </AniLink>

        {/* Grade List (Notes Icon) */}
        <AniLink to="/gradelist" className={`menu-link ${isActive('/gradelist') ? 'active' : ''}`}>
        <svg className="w-8 h-8 md:w-10 md:h-10"  viewBox="0 0 24 24" fill={isActive('/gradelist') ? '#0EF6CC' : '#aaa'}  xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </AniLink>
      </div>
    </div>
  );
};

export default BottomMenu;
