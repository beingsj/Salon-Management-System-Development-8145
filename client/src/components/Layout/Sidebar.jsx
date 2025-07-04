import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Scissors, 
  Calendar, 
  ShoppingCart, 
  UserCheck, 
  FileText, 
  BarChart3,
  Settings,
  Crown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, hasRole } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'BRANCH_MANAGER', 'STAFF']
    },
    {
      name: 'Branches',
      href: '/branches',
      icon: Building2,
      roles: ['ADMIN']
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      roles: ['ADMIN', 'BRANCH_MANAGER', 'STAFF']
    },
    {
      name: 'Services',
      href: '/services',
      icon: Scissors,
      roles: ['ADMIN', 'BRANCH_MANAGER']
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      roles: ['ADMIN', 'BRANCH_MANAGER', 'STAFF']
    },
    {
      name: 'Sales',
      href: '/sales',
      icon: ShoppingCart,
      roles: ['ADMIN', 'BRANCH_MANAGER', 'STAFF']
    },
    {
      name: 'Staff',
      href: '/staff',
      icon: UserCheck,
      roles: ['ADMIN', 'BRANCH_MANAGER']
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      roles: ['ADMIN', 'BRANCH_MANAGER']
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['ADMIN', 'BRANCH_MANAGER']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Femina Flaunt</h2>
                    <p className="text-xs text-gray-500">Salon Management</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-8 flex-1 space-y-1 px-2">
                {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    location.pathname.startsWith(item.href + '/');
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
                        isActive
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User Info */}
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Femina Flaunt</h2>
                  <p className="text-xs text-gray-500">Salon Management</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  location.pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;