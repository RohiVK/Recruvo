import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import { ResumeUploader } from '../candidates/ResumeUploader';
import { ToastProvider, useToast } from '../ui/ToastContext';
import { getHealthStatus } from '../../api/health';

function AppShellContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ healthy: true });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Poll backend health status every 30 seconds
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const status = await getHealthStatus();
      if (isMounted) {
        setHealthStatus(status);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen to custom open-command-palette event
  useEffect(() => {
    const handleOpenCmd = () => setCmdPaletteOpen(true);
    const handleOpenUp = () => setUploaderOpen(true);
    window.addEventListener('open-command-palette', handleOpenCmd);
    window.addEventListener('open-uploader', handleOpenUp);
    return () => {
      window.removeEventListener('open-command-palette', handleOpenCmd);
      window.removeEventListener('open-uploader', handleOpenUp);
    };
  }, []);

  const triggerDataRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        healthStatus={healthStatus}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <TopNav
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCommandPalette={() => setCmdPaletteOpen(true)}
          onOpenUploader={() => setUploaderOpen(true)}
          healthStatus={healthStatus}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                refreshTrigger,
                onOpenUploader: () => setUploaderOpen(true),
                onDataChange: triggerDataRefresh,
              });
            }
            return child;
          })}
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-400">
          ✦ Hirely — AI Hiring Intelligence &copy; {new Date().getFullYear()} &bull; Hire smarter. Hire better.
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onOpenUploader={() => setUploaderOpen(true)}
      />

      {/* Global Resume Uploader Modal */}
      <ResumeUploader
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUploadSuccess={triggerDataRefresh}
      />
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <ToastProvider>
      <AppShellContent>{children}</AppShellContent>
    </ToastProvider>
  );
}

export default AppShell;
