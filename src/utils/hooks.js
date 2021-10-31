import { useState, useEffect } from "react";
import { debounce } from "lodash";

// Source: https://usehooks.com/useWindowSize/
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    const debouncedHandleResize = debounce(handleResize, 200);
    
    window.addEventListener("resize", debouncedHandleResize);
    handleResize();
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);
  return windowSize;
};

export const useCanvasPixelRatio = () => {
  const [pixelRatio, setPixelRatio] = useState(1);

  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    setPixelRatio(dpr / bsr);
  }, []);

  return pixelRatio;
};

export const useAllDocumentFontsLoaded = () => {
  const [allFontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      console.log('All fonts loaded');
      setFontsLoaded(true)
    });
  }, []);

  return allFontsLoaded;
};