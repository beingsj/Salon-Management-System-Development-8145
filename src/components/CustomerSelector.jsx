import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';

const { FiUser, FiSearch, FiUserPlus } = FiIcons;

const CustomerSelector = ({ customers, selectedCustomer, onCustomerSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerSelect = (customer) => {
    onCustomerSelect(customer);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
      
      <div className="relative">
        <div className="flex items-center space-x-3">
          {selectedCustomer ? (
            <div className="flex-1 flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
                <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => onCustomerSelect(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customer or walk-in..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <button
                onClick={() => {
                  // Handle walk-in customer
                  onCustomerSelect(null);
                  setSearchTerm('');
                  setShowDropdown(false);
                }}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-1" />
                Walk-in
              </button>
            </>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && !selectedCustomer && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No customers found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSelector;