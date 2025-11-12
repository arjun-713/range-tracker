import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, History, Battery, Settings } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/trips', icon: History, label: 'Trips' },
    { path: '/charging', icon: Battery, label: 'Charging' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
        <div className="max-w-md mx-auto flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-3 px-4 flex-1 transition ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-text-light/50 dark:text-text-dark/50 hover:text-primary'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 uppercase tracking-wide font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
