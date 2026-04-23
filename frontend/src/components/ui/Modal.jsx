import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ isOpen, onClose, title, description, children, className }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 border border-border-subtle bg-bg-secondary p-6 shadow-lg sm:rounded-xl max-h-[90vh] overflow-y-auto",
                  className
                )}
              >
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  {title && <Dialog.Title className="text-lg font-semibold text-text-primary">{title}</Dialog.Title>}
                  {description && <Dialog.Description className="text-sm text-text-muted">{description}</Dialog.Description>}
                </div>
                {children}
                <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-amber">
                  <X className="h-4 w-4 text-text-primary" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
