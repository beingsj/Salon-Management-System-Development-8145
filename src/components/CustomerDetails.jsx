import React from 'react';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const { 
  FiX, FiUser, FiMail, FiPhone, FiMapPin, FiShoppingCart, FiCalendar, 
  FiDollarSign, FiStar, FiActivity, FiTrendingUp, FiGift, FiClock,
  FiEdit, FiMessageSquare
} = FiIcons;

const CustomerDetails = ({ customer, onClose }) => {
  const { sales } = useData();

  // Get customer's sales history
  const customerSales = sales.filter(sale => sale.customerId === customer.id);
  const recentSales = customerSales.slice(-5).reverse();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'visit': return FiShoppingCart;
      case 'purchase': return FiDollarSign;
      case 'appointment': return FiCalendar;
      case 'review': return FiStar;
      case 'registration': return FiUser;
      default: return FiActivity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'visit': return 'text-blue-600 bg-blue-100';
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'appointment': return 'text-purple-600 bg-purple-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'registration': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-600">
                Customer since {format(new Date(customer.createdAt), 'MMM yyyy')}
              </p>
              <div className="flex items-center mt-1 space-x-2">
                {customer.loyaltyPoints && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" />
                    {customer.loyaltyPoints} points
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {customer.totalSpent > 1000 ? 'VIP' : customer.visits > 10 ? 'Regular' : 'New'} Customer
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-primary-600" />
                Contact Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{customer.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-900">{customer.address}</span>
                </div>
                {customer.dateOfBirth && (
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Born {format(new Date(customer.dateOfBirth), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {customer.gender && (
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{customer.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <SafeIcon icon={FiShoppingCart} className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{customerSales.length}</p>
                    <p className="text-sm text-blue-700">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-green-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{customer.totalSpent?.toFixed(0) || '0'}</p>
                    <p className="text-sm text-green-700">Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">₹{customer.averageSpend?.toFixed(0) || '0'}</p>
                    <p className="text-sm text-purple-700">Avg Spend</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <SafeIcon icon={FiCalendar} className="w-8 h-8 text-orange-600" />
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {customer.lastVisit ? format(new Date(customer.lastVisit), 'MMM dd') : 'Never'}
                    </p>
                    <p className="text-sm text-orange-700">Last Visit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Used */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiActivity} className="w-5 h-5 mr-2 text-primary-600" />
              Preferred Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {customer.services?.length > 0 ? (
                customer.services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No services recorded yet</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiMessageSquare} className="w-5 h-5 mr-2 text-primary-600" />
                Notes
              </h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-gray-900">{customer.notes}</p>
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiActivity} className="w-5 h-5 mr-2 text-primary-600" />
              Recent Activity
            </h4>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {customer.activityLog?.length > 0 ? (
                customer.activityLog.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  const colorClasses = getActivityColor(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100"
                    >
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <SafeIcon icon={IconComponent} className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                          </p>
                          {activity.amount && (
                            <span className="text-xs font-medium text-green-600">
                              ₹{activity.amount.toFixed(2)}
                            </span>
                          )}
                          {activity.rating && (
                            <div className="flex items-center">
                              {[...Array(activity.rating)].map((_, i) => (
                                <SafeIcon key={i} icon={FiStar} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2 text-primary-600" />
              Recent Orders
            </h4>
            {recentSales.length > 0 ? (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <SafeIcon icon={FiShoppingCart} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sale.invoiceNumber}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{sale.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{sale.paymentMethod}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders found</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
              Edit Customer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
              Create Order
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerDetails;