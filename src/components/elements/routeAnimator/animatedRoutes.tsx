// src/components/AnimatedOutlet.jsx
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useLocation, useOutlet } from "react-router-dom";

const AnimatedOutlet = () => {
  const { pathname } = useLocation();
  //   const prevPathname = useRef(pathname);
  const location = useLocation();
  const element = useOutlet();
  //   useEffect(() => {
  //     prevPathname.current = pathname;
  //   }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1, overflowY: "auto" }}
        // exit={{ opacity: 0.2 }}
        transition={{ duration: 0.4, ease: "anticipate" }}
      >
        {element && React.cloneElement(element, { key: location.pathname })}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
