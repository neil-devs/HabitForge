import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { useUiStore } from '../../store/uiStore';

export const ConfirmModal = () => {
  const { confirmDialog, closeConfirm } = useUiStore();
  const { isOpen, title, message, confirmText, cancelText, onConfirm } = confirmDialog;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeConfirm}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 shadow-2xl max-w-md w-full pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-accent-rose"></div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-rose/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-accent-rose" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    {message}
                  </p>
                  
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeConfirm}>
                      {cancelText}
                    </Button>
                    <Button 
                      className="bg-accent-rose hover:bg-accent-rose/90 text-white border-none"
                      onClick={handleConfirm}
                    >
                      {confirmText}
                    </Button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={closeConfirm}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
