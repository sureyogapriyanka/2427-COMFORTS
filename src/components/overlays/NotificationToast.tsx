import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function NotificationToast() {
  const { notification, clearNotification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-[#E8E1D7] bg-white p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        {notification.type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 text-elan-sage shrink-0 mt-0.5" />
        ) : (
          <Info className="h-5 w-5 text-elan-sage shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-xs text-elan-ink leading-relaxed">
          {notification.message}
        </div>

        <button
          type="button"
          onClick={clearNotification}
          className="text-elan-muted hover:text-elan-ink p-0.5"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
