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
    <div className="min-h-screen flex flex-col bg-white dark:bg-background-dark">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-border-light dark:border-border-dark z-10">
        <div className="max-w-md mx-auto flex justify-around h-20 items-start pt-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 flex-1 transition ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
