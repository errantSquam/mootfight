import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<string>('');

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < 10)) {
        
        setScrollDirection(direction);
      }
      //console.log(direction)
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, [scrollDirection]);

  return scrollDirection;
};

export function isScrolledBanner() {
  const [isScrolledBanner, setIsScrolledBanner] = useState<boolean>(false);

  useEffect(() => {

    const updateScrollDirection = () => {
      setIsScrolledBanner(window.pageYOffset > 20)
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, [isScrolledBanner]);

  return isScrolledBanner;
};

export function isScrolledNavbar() {
  const [isScrolledNavbar, setIsScrolledNavbar] = useState<number>(0);

  useEffect(() => {

    const updateScrollDirection = () => {
      setIsScrolledNavbar(window.pageYOffset)
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, [isScrolledNavbar]);

  return isScrolledNavbar;
};