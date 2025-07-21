// AnimatedDialogContent.tsx

import { DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";

function AnimatedDialogContent(
  props: ComponentProps<typeof DialogContent>
) {
  const { children, className, ...rest } = props;

  return (
    <DialogContent {...rest} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="space-y-4 p-6"
      >
        {children}
      </motion.div>
    </DialogContent>
  );
}

export default AnimatedDialogContent; // ✅ Only ONE default export
