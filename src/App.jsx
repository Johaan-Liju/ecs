import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import EnquiryDrawer from "./components/EnquiryDrawer";
import Crosshair from "./components/Crosshair";
import EnquiryProvider from "./context/EnquiryProvider";

import Home from "./pages/Home";
import Materials from "./pages/Materials";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { getLenis, scrollTo, startLenis, stopLenis } from "./lib/lenis";

function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    startLenis();

    // Anchor links go through Lenis rather than the browser's own jump.
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollTo(el);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stopLenis();
    };
  }, [reduced]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();

  const transition = reduced
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main id="main" key={location.pathname} {...transition}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <EnquiryProvider>
      <SmoothScroll />
      <ScrollToTop />
      <Loader />
      <Header />
      <div className="pt-[68px]">
        <AnimatedRoutes />
        <Footer />
      </div>
      <EnquiryDrawer />
      <Crosshair />
    </EnquiryProvider>
  );
}
