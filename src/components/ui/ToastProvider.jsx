// ToastProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const toastWithDefaults = {
      duration: 5000,  // Default duration of 5 seconds
      type: 'default', // default, success, error, warning, info
      ...toast
    };
    
    setToasts((prevToasts) => [...prevToasts, toastWithDefaults]);

    // Auto-remove toast after duration
    if (toastWithDefaults.duration) {
      setTimeout(() => {
        removeToast(toastWithDefaults.id);
      }, toastWithDefaults.duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`max-w-sm w-full p-4 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-green-600' :
                toast.type === 'error' ? 'bg-red-600' :
                toast.type === 'warning' ? 'bg-yellow-600' :
                toast.type === 'info' ? 'bg-blue-600' :
                'bg-zinc-800'
              } text-white`}
            >
              <div className="flex items-center justify-between">
                {toast.title && (
                  <h3 className="font-medium">{toast.title}</h3>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 text-white/80 hover:text-white focus:outline-none"
                >
                  ×
                </button>
              </div>
              {toast.message && (
                <p className="mt-1 text-sm text-white/90">{toast.message}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = (options) => {
    if (typeof options === 'string') {
      options = { message: options };
    }
    
    const id = Date.now().toString();
    context.addToast({ id, ...options });
  };

  // Add convenience methods
  toast.success = (message, options = {}) => {
    toast({ ...options, message, type: 'success' });
  };

  toast.error = (message, options = {}) => {
    toast({ ...options, message, type: 'error' });
  };

  toast.warning = (message, options = {}) => {
    toast({ ...options, message, type: 'warning' });
  };

  toast.info = (message, options = {}) => {
    toast({ ...options, message, type: 'info' });
  };

  return toast;
};

export default ToastProvider;