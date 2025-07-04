import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerForm from '../components/CustomerForm';
import CustomerDetails from '../components/CustomerDetails';
import { format } from 'date-fns';

const { 
  FiPlus, FiSearch, FiUsers, FiEdit, FiTrash2, FiEye, FiMail, FiPhone,
  FiMapPin, FiCalendar, FiStar, FiTrendingUp, FiDollarSign, FiActivity,
  FiFilter, FiDownload, FiUserCheck
} = FiIcons;

const Customers = () => {
  const { customers, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = (() => {
        switch (filterBy) {
          case 'active':
            return customer.lastVisit && new Date(customer.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          case 'inactive':
            return !customer.lastVisit || new Date(customer.lastVisit) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          case 'vip':
            return customer.totalSpent > 1000;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'lastVisit':
          return new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0);
        case 'visits':
          return (b.visits || 0) - (a.visits || 0);
        default:
          return 0;
      }
    });

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(customerId);
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const exportCustomers = () => {
    // Mock export functionality
    const csvContent = [
      'Name,Email,Phone,Total Spent,Last Visit,Visits',
      ...filteredCustomers.map(customer => 
        `${customer.name},${customer.email},${customer.phone},${customer.totalSpent},${customer.lastVisit || 'Never'},${customer.visits || 0}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  const getCustomerSegment = (customer) => {
    if (customer.totalSpent > 1000) return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (customer.visits > 10) return { label: 'Regular', color: 'bg-blue-100 text-blue-800' };
    if (customer.visits > 5) return { label: 'Frequent', color: 'bg-green-100 text-green-800' };
    return { label: 'New', color: 'bg-gray-100 text-gray-800' };
  };

  const CustomerCard = ({ customer, index }) => {
    const segment = getCustomerSegment(customer);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${segment.color}`}>
                {segment.label}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleViewDetails(customer)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleEdit(customer)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(customer.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
            {customer.phone}
          </div>
          {customer.address && (
            <div className="flex items-start text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 mt-0.5" />
              <span className="truncate">{customer.address}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{customer.totalSpent?.toFixed(0) || '0'}</div>
            <div className="text-xs text-green-700">Total Spent</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{customer.visits || 0}</div>
            <div className="text-xs text-blue-700">Visits</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
            Last visit: {customer.lastVisit ? format(new Date(customer.lastVisit), 'MMM dd') : 'Never'}
          </div>
          {customer.loyaltyPoints && (
            <div className="flex items-center text-yellow-600">
              <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
              {customer.loyaltyPoints} pts
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Customer Management</h2>
            <p className="text-gray-600 mt-1">Manage your customer database and track their journey</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportCustomers}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCustomer(null);
                setShowForm(true);
              }}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Add Customer
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Customers', value: customers.length, icon: FiUsers, color: 'blue' },
          { title: 'Active This Month', value: customers.filter(c => c.lastVisit && new Date(c.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: FiUserCheck, color: 'green' },
          { title: 'VIP Customers', value: customers.filter(c => c.totalSpent > 1000).length, icon: FiStar, color: 'purple' },
          { title: 'Total Revenue', value: `₹${customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toFixed(0)}`, icon: FiDollarSign, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Spending</option>
            <option value="lastVisit">Sort by Last Visit</option>
            <option value="visits">Sort by Visits</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Customers</option>
            <option value="active">Active (30 days)</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP Customers</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SafeIcon icon={FiUsers} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SafeIcon icon={FiActivity} className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500 ml-4">
              {filteredCustomers.length} customers
            </span>
          </div>
        </div>
      </motion.div>

      {/* Customer List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {filteredCustomers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer, index) => (
                <CustomerCard key={customer.id} customer={customer} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer, index) => {
                    const segment = getCustomerSegment(customer);
                    return (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${segment.color}`}>
                                {segment.label}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent?.toFixed(2) || '0.00'}</div>
                          <div className="text-sm text-gray-500">{customer.visits || 0} visits</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.lastVisit ? format(new Date(customer.lastVisit), 'MMM dd, yyyy') : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(customer)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <SafeIcon icon={FiEye} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(customer)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <SafeIcon icon={FiEdit} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add First Customer
              </motion.button>
            )}
          </div>
        )}
      </motion.div>

      {/* Customer Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CustomerForm
            customer={selectedCustomer}
            onClose={() => {
              setShowForm(false);
              setSelectedCustomer(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showDetails && selectedCustomer && (
          <CustomerDetails
            customer={selectedCustomer}
            onClose={() => {
              setShowDetails(false);
              setSelectedCustomer(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;