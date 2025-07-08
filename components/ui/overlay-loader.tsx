import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/loader";

interface OverlayLoaderProps {
  loading: boolean;
}

export default function OverlayLoader({ loading }: OverlayLoaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 z-1000 w-screen h-screen bg-black/25 backdrop-blur-[3px] cursor-progress"
          key="overlay-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Loader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
