import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';

const { FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiTag, FiX, FiCreditCard } = FiIcons;

const POSCart = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  totals,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discount,
  setDiscount,
  paymentMethod,
  setPaymentMethod,
  onProcessPayment
}) => {
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiShoppingCart} className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900">Cart</h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
            {cart.length}
          </span>
        </div>
      </div>

      <div className="p-6">
        {cart.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.serviceId}-${item.variant}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.serviceName}</h4>
                    <p className="text-xs text-gray-500">{item.variant}</p>
                    <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onUpdateQuantity(item.serviceId, item.variant, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <SafeIcon icon={FiMinus} className="w-4 h-4 text-gray-500" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.serviceId, item.variant, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="w-16 text-right">
                      <p className="text-sm font-medium text-gray-900">₹{item.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.serviceId, item.variant)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiTag} className="w-5 h-5 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Coupon</h4>
              </div>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {appliedCoupon.coupon.code}
                    </p>
                    <p className="text-xs text-green-700">
                      Discount: ₹{appliedCoupon.discount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="p-1 text-green-700 hover:bg-green-100 rounded-full transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={onApplyCoupon}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Manual Discount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manual Discount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST:</span>
                  <span className="text-gray-900">₹{totals.gstAmount.toFixed(2)}</span>
                </div>
                {totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount:</span>
                    <span className="text-green-600">-₹{totals.couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {totals.manualDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Manual Discount:</span>
                    <span className="text-blue-600">-₹{totals.manualDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">₹{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === method.value
                        ? 'bg-primary-100 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Process Payment Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProcessPayment}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2" />
              Process Payment - ₹{totals.total.toFixed(2)}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiShoppingCart} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400">Add services to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSCart;