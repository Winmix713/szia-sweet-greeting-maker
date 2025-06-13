
import React from 'react';
import { Button } from '@heroui/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  toastMessage: {
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  };
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toastMessage,
  onClose
}) => {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 flex items-center gap-3 transition-all duration-300 ${
      toastMessage.type === "success" ? "bg-success text-white" :
      toastMessage.type === "error" ? "bg-danger text-white" :
      "bg-foreground text-background"
    }`}>
      {toastMessage.type === "success" ? <CheckCircle width={20} /> :
       toastMessage.type === "error" ? <AlertCircle width={20} /> :
       <Info width={20} />}
      <div>
        <h4 className="font-medium text-sm">{toastMessage.title}</h4>
        <p className="text-xs opacity-90">{toastMessage.description}</p>
      </div>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="ml-auto text-white/80 hover:text-white"
        onPress={onClose}
      >
        <X width={14} />
      </Button>
    </div>
  );
};
