import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { animationpagein } from './utils/animations';
import BottomMenu from './components/BottomMenu';
import Footer from './components/Footer';

const RootLayout = () => {
  useEffect(() => {
    animationpagein();
  }, []);

  return (
    <>
      <div id="banner-1" className="banner"></div>
      <div id="banner-2" className="banner"></div>
      <div id="banner-3" className="banner"></div>
      <div id="banner-4" className="banner"></div>
      <main>
        <Outlet /> {/* This renders the nested route components */}
      </main>
      <BottomMenu />
      <Footer />
    </>
  );
};

export default RootLayout;
