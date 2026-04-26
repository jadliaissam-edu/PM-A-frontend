import React, { useEffect, useRef } from "react";
import { X, Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useNotificationStore } from "../store/notification-store";

const NotificationSidebar = () => {
  const { isOpen, close, notifications, markAsRead, markAllAsRead, loading } = useNotificationStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "warning": return <AlertTriangle size={18} className="text-amber-500" />;
      case "error": return <AlertCircle size={18} className="text-rose-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white shadow-2xl border-l border-zinc-200 z-[101] transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Notifications</h2>
                <p className="text-xs text-zinc-500">{notifications.filter(n => !n.isRead).length} non lues</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={markAllAsRead}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition hover:bg-zinc-100 rounded-lg"
                title="Tout marquer comme lu"
              >
                <CheckCheck size={20} />
              </button>
              <button 
                onClick={close}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition hover:bg-zinc-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {loading && notifications.length === 0 ? (
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 w-full rounded-2xl bg-zinc-100 animate-pulse" />
                  ))}
               </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                    notification.isRead 
                      ? "bg-white border-zinc-100 opacity-70" 
                      : "bg-zinc-50 border-zinc-200 shadow-sm hover:border-zinc-300"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    notification.isRead ? "bg-zinc-50" : "bg-white border border-zinc-100 shadow-sm"
                  }`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-bold truncate ${notification.isRead ? "text-zinc-500" : "text-zinc-900"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-zinc-400 whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${notification.isRead ? "text-zinc-400" : "text-zinc-600"}`}>
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-zinc-900 animate-pulse" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-200">
                  <Bell size={32} />
                </div>
                <p className="text-sm font-medium text-zinc-500">Aucune notification pour le moment.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-100">
            <button 
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 active:scale-95"
            >
              Voir tout l&apos;historique
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
