
import { useState, useCallback } from 'react';

interface ToastMessage {
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
}

export const useToastNotification = () => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const showToast = useCallback((title: string, description: string, type: 'success' | 'error' | 'info', clear = false) => {
    if (clear) {
      setToastMessage(null);
      return;
    }
    
    setToastMessage({ title, description, type });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  }, []);

  return { showToast, toastMessage };
};
