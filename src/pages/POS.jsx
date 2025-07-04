import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import POSCart from '../components/POSCart';
import ServiceSelector from '../components/ServiceSelector';
import CustomerSelector from '../components/CustomerSelector';

const { FiShoppingCart, FiUser, FiCreditCard } = FiIcons;

const POS = () => {
  const { services, customers, addSale, validateCoupon, applyCoupon } = useData();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);

  const addToCart = (service, variant = 'Regular', quantity = 1) => {
    const existingItem = cart.find(item => 
      item.serviceId === service.id && item.variant === variant
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.serviceId === service.id && item.variant === variant
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        serviceId: service.id,
        serviceName: service.name,
        variant,
        price: service.price,
        gst: service.gst,
        quantity,
        total: service.price * quantity
      }]);
    }
  };

  const removeFromCart = (serviceId, variant) => {
    setCart(cart.filter(item => 
      !(item.serviceId === serviceId && item.variant === variant)
    ));
  };

  const updateQuantity = (serviceId, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId, variant);
    } else {
      setCart(cart.map(item =>
        item.serviceId === serviceId && item.variant === variant
          ? { ...item, quantity, total: item.price * quantity }
          : item
      ));
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const gstAmount = cart.reduce((sum, item) => sum + (item.total * item.gst / 100), 0);
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const manualDiscount = discount;
    const totalDiscount = couponDiscount + manualDiscount;
    const total = subtotal + gstAmount - totalDiscount;

    return {
      subtotal,
      gstAmount,
      couponDiscount,
      manualDiscount,
      totalDiscount,
      total: Math.max(0, total)
    };
  };

  const applyCouponCode = () => {
    if (!couponCode.trim()) return;
    
    const totals = calculateTotals();
    const result = validateCoupon(couponCode, totals.subtotal);
    
    if (result.valid) {
      setAppliedCoupon(result);
      setCouponCode('');
    } else {
      alert(result.message);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const processPayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const totals = calculateTotals();
    const saleData = {
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      services: cart,
      subtotal: totals.subtotal,
      gst: totals.gstAmount,
      discount: totals.totalDiscount,
      total: totals.total,
      paymentMethod,
      couponId: appliedCoupon?.coupon?.id,
      staffId: 1, // Mock staff ID
      staffName: 'Current User'
    };

    const sale = addSale(saleData);
    
    if (appliedCoupon) {
      applyCoupon(appliedCoupon.coupon.id);
    }

    // Reset form
    setCart([]);
    setSelectedCustomer(null);
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscount(0);
    setPaymentMethod('cash');

    alert(`Payment processed successfully! Invoice: ${sale.invoiceNumber}`);
  };

  const totals = calculateTotals();

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
            Point of Sale
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Process sales and manage transactions
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Services and Customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CustomerSelector
              customers={customers}
              selectedCustomer={selectedCustomer}
              onCustomerSelect={setSelectedCustomer}
            />
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ServiceSelector
              services={services}
              onAddToCart={addToCart}
            />
          </motion.div>
        </div>

        {/* Right Column - Cart and Checkout */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <POSCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              totals={totals}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCouponCode}
              onRemoveCoupon={removeCoupon}
              discount={discount}
              setDiscount={setDiscount}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onProcessPayment={processPayment}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default POS;