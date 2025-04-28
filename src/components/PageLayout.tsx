// components/PageLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

export default function PageLayout() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Outlet />
      </div>
    </AnimatePresence>
  );
}
