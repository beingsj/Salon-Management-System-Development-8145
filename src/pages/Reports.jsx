import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

const { FiFileText, FiDownload, FiCalendar, FiFilter, FiPrinter, FiMail } = FiIcons;

const Reports = () => {
  const { sales, customers, services, coupons } = useData();
  const { user } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate date range
  const getDateRange = () => {
    const today = new Date();
    
    switch (dateRange) {
      case 'today':
        return { start: startOfDay(today), end: endOfDay(today) };
      case 'week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'month':
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case 'custom':
        return { 
          start: customStartDate ? new Date(customStartDate) : startOfDay(today),
          end: customEndDate ? new Date(customEndDate) : endOfDay(today)
        };
      default:
        return { start: startOfDay(today), end: endOfDay(today) };
    }
  };

  const { start: startDate, end: endDate } = getDateRange();

  // Filter data based on date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Generate sales report data
  const generateSalesReport = () => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalGST = filteredSales.reduce((sum, sale) => sum + sale.gst, 0);
    const totalDiscount = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    const paymentMethodBreakdown = ['Cash', 'Card', 'UPI'].map(method => {
      const methodSales = filteredSales.filter(sale => sale.paymentMethod === method);
      return {
        method,
        count: methodSales.length,
        amount: methodSales.reduce((sum, sale) => sum + sale.total, 0)
      };
    });

    return {
      totalSales,
      totalRevenue,
      totalGST,
      totalDiscount,
      avgOrderValue,
      paymentMethodBreakdown,
      salesList: filteredSales
    };
  };

  // Generate customer report data
  const generateCustomerReport = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(customer => 
      filteredSales.some(sale => sale.customerId === customer.id)
    ).length;

    const customerSpending = customers.map(customer => {
      const customerSales = filteredSales.filter(sale => sale.customerId === customer.id);
      const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
      return {
        ...customer,
        ordersInPeriod: customerSales.length,
        totalSpentInPeriod: totalSpent
      };
    }).sort((a, b) => b.totalSpentInPeriod - a.totalSpentInPeriod);

    return {
      totalCustomers,
      activeCustomers,
      customerSpending: customerSpending.slice(0, 10) // Top 10
    };
  };

  // Generate service report data
  const generateServiceReport = () => {
    const servicePerformance = services.map(service => {
      const serviceSales = filteredSales.reduce((count, sale) => {
        const serviceCount = sale.services.filter(s => s.serviceId === service.id).length;
        return count + serviceCount;
      }, 0);
      
      const serviceRevenue = filteredSales.reduce((revenue, sale) => {
        const serviceRevenue = sale.services
          .filter(s => s.serviceId === service.id)
          .reduce((sum, s) => sum + s.total, 0);
        return revenue + serviceRevenue;
      }, 0);

      return {
        ...service,
        salesCount: serviceSales,
        revenue: serviceRevenue
      };
    }).sort((a, b) => b.salesCount - a.salesCount);

    return { servicePerformance };
  };

  // Generate coupon report data
  const generateCouponReport = () => {
    const couponUsage = coupons.map(coupon => {
      const couponSales = filteredSales.filter(sale => sale.couponId === coupon.id);
      const totalDiscount = couponSales.reduce((sum, sale) => sum + sale.discount, 0);
      
      return {
        ...coupon,
        usedInPeriod: couponSales.length,
        discountGiven: totalDiscount,
        revenueImpact: couponSales.reduce((sum, sale) => sum + sale.total, 0)
      };
    }).filter(coupon => coupon.usedInPeriod > 0);

    return { couponUsage };
  };

  const reportData = {
    sales: generateSalesReport(),
    customers: generateCustomerReport(),
    services: generateServiceReport(),
    coupons: generateCouponReport()
  };

  const exportReport = (format) => {
    // Mock export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const printReport = () => {
    window.print();
  };

  const emailReport = () => {
    alert('Email report functionality would be implemented here');
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
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate detailed reports for your business performance
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={printReport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <SafeIcon icon={FiPrinter} className="w-4 h-4 mr-2" />
            Print
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportReport('pdf')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="sales">Sales Report</option>
              <option value="customers">Customer Report</option>
              <option value="services">Service Report</option>
              <option value="coupons">Coupon Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Report Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </h3>
            <span className="text-sm text-gray-500">
              {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Sales Report */}
          {reportType === 'sales' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.sales.totalSales}
                  </div>
                  <div className="text-sm text-blue-800">Total Sales</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{reportData.sales.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-800">Total Revenue</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{reportData.sales.avgOrderValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-purple-800">Avg Order Value</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{reportData.sales.totalGST.toFixed(2)}
                  </div>
                  <div className="text-sm text-orange-800">Total GST</div>
                </div>
              </div>

              {/* Payment Method Breakdown */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Payment Method Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportData.sales.paymentMethodBreakdown.map((method) => (
                    <div key={method.method} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {method.count} orders
                      </div>
                      <div className="text-sm text-gray-600">
                        {method.method}: ₹{method.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sales */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Sales Transactions</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.sales.salesList.map((sale) => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sale.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{sale.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customer Report */}
          {reportType === 'customers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.customers.totalCustomers}
                  </div>
                  <div className="text-sm text-blue-800">Total Customers</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.customers.activeCustomers}
                  </div>
                  <div className="text-sm text-green-800">Active Customers</div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Top Customers</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Lifetime
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.customers.customerSpending.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.ordersInPeriod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{customer.totalSpentInPeriod.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{customer.totalSpent.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Service Report */}
          {reportType === 'services' && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Service Performance</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.services.servicePerformance.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.salesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{service.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{service.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Coupon Report */}
          {reportType === 'coupons' && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Coupon Usage</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coupon Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount Given
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.coupons.couponUsage.map((coupon) => (
                      <tr key={coupon.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {coupon.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.usedInPeriod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{coupon.discountGiven.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{coupon.revenueImpact.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;