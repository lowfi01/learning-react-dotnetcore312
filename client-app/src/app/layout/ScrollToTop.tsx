import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Implements an automatic scroll to top of page for our application.
// - used to solve when navigating back to home page from the bottom of
//   the activities list.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
