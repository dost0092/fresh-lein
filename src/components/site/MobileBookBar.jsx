import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Phone-only booking shortcut. Slides in once the visitor scrolls past the
 * hero, and leaves room on the right for the assistant button.
 */
export default function MobileBookBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-4 right-[5.25rem] z-40 lg:hidden"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Link
            to="/book-audit"
            className="group flex h-14 items-center justify-between gap-3 rounded-full bg-ink pl-5 pr-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_40px_-12px_rgba(15,20,18,0.55)]"
          >
            <span className="min-w-0">
              <span className="block text-[14.5px] font-semibold leading-tight">Book a free call</span>
              <span className="block truncate text-[12px] leading-tight text-white/55">30 min · reply in 1 business day</span>
            </span>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink">
              <ArrowRight className="h-4 w-4 transition-transform group-active:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
