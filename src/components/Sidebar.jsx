import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const { 
  FiHome, FiUsers, FiShoppingCart, FiMonitor, FiTag, FiBarChart3, 
  FiFileText, FiSettings, FiX, FiPlus, FiTool, FiPackage, 
  FiCalendar, FiUserCheck, FiDollarSign
} = FiIcons;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, hasPermission } = useAuth();
  const { settings } = useData();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome, permission: true },
    { name: 'Customers', href: '/customers', icon: FiUsers, permission: hasPermission('customers') },
    { name: 'Sales', href: '/sales', icon: FiShoppingCart, permission: hasPermission('sales') },
    { name: 'POS', href: '/pos', icon: FiMonitor, permission: hasPermission('pos') },
    { name: 'Services', href: '/services', icon: FiTool, permission: hasPermission('services') },
    { name: 'Inventory', href: '/inventory', icon: FiPackage, permission: hasPermission('inventory') },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar, permission: hasPermission('appointments') },
    { name: 'Staff', href: '/staff', icon: FiUserCheck, permission: hasPermission('staff') },
    { name: 'Expenses', href: '/expenses', icon: FiDollarSign, permission: hasPermission('expenses') },
    { name: 'Coupons', href: '/coupons', icon: FiTag, permission: hasPermission('coupons') },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart3, permission: hasPermission('analytics') },
    { name: 'Reports', href: '/reports', icon: FiFileText, permission: hasPermission('reports') },
    { name: 'Settings', href: '/settings', icon: FiSettings, permission: hasPermission('settings') }
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex z-40 lg:hidden"
          >
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setIsOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {settings.companyLogo ? (
              <img 
                src={settings.companyLogo} 
                alt="Company Logo" 
                className="h-8 w-8 rounded-lg object-cover" 
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BM</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {settings.companyName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1 flex-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {navigation.map((item) => {
            if (!item.permission) return null;
            
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <SafeIcon 
                  icon={item.icon} 
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`} 
                />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <NavLink
              to="/pos"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
              New Sale
            </NavLink>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;