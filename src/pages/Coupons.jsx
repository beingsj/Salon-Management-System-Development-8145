import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CouponForm from '../components/CouponForm';

const { FiPlus, FiSearch, FiTag, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } = FiIcons;

const Coupons = () => {
  const { coupons, deleteCoupon, updateCoupon } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(couponId);
    }
  };

  const toggleCouponStatus = (couponId, currentStatus) => {
    updateCoupon(couponId, { isActive: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:flex md:items-center md:justify-between"
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Coupon Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount coupons for your business
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCoupon(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Coupon
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </motion.div>

      {/* Coupons Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCoupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTag} className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{coupon.code}</h3>
                </div>
                <button
                  onClick={() => toggleCouponStatus(coupon.id, coupon.isActive)}
                  className={`${coupon.isActive ? 'text-green-600' : 'text-gray-400'} hover:opacity-75`}
                >
                  <SafeIcon icon={coupon.isActive ? FiToggleRight : FiToggleLeft} className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Discount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Min Amount:</span>
                  <span className="text-sm font-medium text-gray-900">₹{coupon.minAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Usage:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Valid Until:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">{coupon.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(coupon)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit Coupon"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Coupon"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiTag} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first coupon to get started'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create First Coupon
            </motion.button>
          )}
        </div>
      )}

      {/* Coupon Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CouponForm
            coupon={selectedCoupon}
            onClose={() => {
              setShowForm(false);
              setSelectedCoupon(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Coupons;