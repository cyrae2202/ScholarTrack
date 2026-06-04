import { Link, useLocation } from 'wouter';
import { ReactNode } from 'react';
import { useNavigate } from '@/components/layout/NavContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { navigate } = useNavigate();

  const navItem = (href: string, label: string, icon: ReactNode) => {
    const active = location === href;
    return (
      <Link href={href}>
        <a className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          {icon}
          {label}
        </a>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <span className="text-base font-bold text-gray-900">Admin</span>
        </div>

        <nav className="space-y-1 flex-1">
          {navItem('/admin/dashboard', 'Overview',
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )}
          {navItem('/admin/opportunities', 'Opportunities',
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )}
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to App
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
