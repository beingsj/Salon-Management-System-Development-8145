import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import { format, startOfDay, endOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { 
  FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiTag, FiCalendar,
  FiArrowUp, FiArrowDown, FiEye, FiStar, FiClock, FiTarget, FiAward
} = FiIcons;

const Dashboard = () => {
  const { customers, sales, coupons, services, staff } = useData();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('today');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: Math.floor(Math.random() * 50) + 10,
    serverLoad: Math.floor(Math.random() * 30) + 40,
    responseTime: Math.floor(Math.random() * 100) + 200
  });

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        serverLoad: Math.floor(Math.random() * 30) + 40,
        responseTime: Math.floor(Math.random() * 100) + 200
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDateRange = () => {
    const today = new Date();
    switch (timeRange) {
      case 'today':
        return { start: startOfDay(today), end: endOfDay(today) };
      case 'week':
        return { start: startOfWeek(today), end: today };
      case 'month':
        return { start: startOfMonth(today), end: today };
      case '7days':
        return { start: subDays(today, 7), end: today };
      default:
        return { start: startOfDay(today), end: endOfDay(today) };
    }
  };

  const { start: startDate, end: endDate } = getDateRange();

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Calculate metrics
  const totalCustomers = customers.length;
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Previous period comparison
  const previousPeriodSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const periodDiff = endDate - startDate;
    const prevStart = new Date(startDate - periodDiff);
    const prevEnd = startDate;
    return saleDate >= prevStart && saleDate <= prevEnd;
  });

  const prevRevenue = previousPeriodSales.reduce((sum, sale) => sum + sale.total, 0);
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  // Chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySales = sales.filter(sale => 
      new Date(sale.date).toDateString() === date.toDateString()
    );
    return {
      date: format(date, 'MMM dd'),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
      customers: new Set(daySales.map(sale => sale.customerId)).size
    };
  });

  const servicePopularity = services.map(service => {
    const serviceCount = filteredSales.reduce((count, sale) => {
      return count + sale.services.filter(s => s.serviceId === service.id).length;
    }, 0);
    return {
      name: service.name.substring(0, 10),
      value: serviceCount,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
  }).filter(item => item.value > 0);

  const stats = [
    {
      name: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
      changeType: revenueChange >= 0 ? 'positive' : 'negative',
      trend: chartData.slice(-4).map(d => d.revenue)
    },
    {
      name: 'Total Sales',
      value: totalSales.toString(),
      icon: FiShoppingCart,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
      trend: chartData.slice(-4).map(d => d.sales)
    },
    {
      name: 'Total Customers',
      value: totalCustomers.toString(),
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive',
      trend: chartData.slice(-4).map(d => d.customers)
    },
    {
      name: 'Avg Order Value',
      value: `₹${avgOrderValue.toFixed(2)}`,
      icon: FiTarget,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive',
      trend: [25, 35, 30, 40]
    },
    {
      name: 'Active Coupons',
      value: activeCoupons.toString(),
      icon: FiTag,
      color: 'bg-pink-500',
      change: '+3%',
      changeType: 'positive',
      trend: [2, 3, 2, 3]
    },
    {
      name: 'Staff Performance',
      value: '4.8★',
      icon: FiStar,
      color: 'bg-yellow-500',
      change: '+0.2',
      changeType: 'positive',
      trend: [4.5, 4.6, 4.7, 4.8]
    }
  ];

  const quickActions = [
    { name: 'New Sale', icon: FiShoppingCart, href: '/pos', color: 'bg-green-500' },
    { name: 'Add Customer', icon: FiUsers, href: '/customers', color: 'bg-blue-500' },
    { name: 'View Reports', icon: FiTarget, href: '/reports', color: 'bg-purple-500' },
    { name: 'Manage Staff', icon: FiAward, href: '/staff', color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { type: 'sale', message: 'New sale completed - ₹450', time: '2 min ago', icon: FiShoppingCart, color: 'text-green-600' },
    { type: 'customer', message: 'New customer registered', time: '5 min ago', icon: FiUsers, color: 'text-blue-600' },
    { type: 'coupon', message: 'Coupon SAVE20 was used', time: '8 min ago', icon: FiTag, color: 'text-purple-600' },
    { type: 'review', message: 'New 5-star review received', time: '12 min ago', icon: FiStar, color: 'text-yellow-600' }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
            <p className="text-2xl font-semibold">
              {format(new Date(), 'HH:mm')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <SafeIcon 
                    icon={stat.changeType === 'positive' ? FiArrowUp : FiArrowDown} 
                    className="w-4 h-4 mr-1" 
                  />
                  {stat.change}
                </span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.name}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
            
            {/* Mini trend chart */}
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.trend.map((value, i) => ({ value, index: i }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={stat.color.replace('bg-', '#')} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Revenue Trend</h3>
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`₹${value}`, 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Popular Services</h3>
            <SafeIcon icon={FiEye} className="w-5 h-5 text-purple-500" />
          </div>
          {servicePopularity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicePopularity}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {servicePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No service data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color} bg-opacity-10 mr-3`}>
                  <SafeIcon icon={action.icon} className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{realTimeData.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Load</span>
              <span className="font-semibold text-blue-600">{realTimeData.serverLoad}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="font-semibold text-purple-600">{realTimeData.responseTime}ms</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <SafeIcon icon={activity.icon} className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;