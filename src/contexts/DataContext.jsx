import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [services, setServices] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    companyLogo: null,
    companyName: 'Business Management System',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    gstEnabled: true,
    gstRate: 18,
    taxSettings: {
      cgst: 9,
      sgst: 9,
      igst: 18
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    paymentMethods: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Digital Wallet'],
    loyaltyPointsRate: 1,
    autoBackup: true,
    receiptSettings: {
      showLogo: true,
      showGST: true,
      footerMessage: 'Thank you for your business!'
    }
  });

  useEffect(() => {
    initializeMockData();
    loadDataFromStorage();
  }, []);

  useEffect(() => {
    saveDataToStorage();
  }, [customers, sales, services, coupons, staff, inventory, appointments, expenses, outlets, suppliers, loyaltyPrograms]);

  const saveDataToStorage = () => {
    try {
      const data = {
        customers,
        sales,
        services,
        coupons,
        staff,
        inventory,
        appointments,
        expenses,
        outlets,
        suppliers,
        loyaltyPrograms,
        settings
      };
      localStorage.setItem('businessData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  const loadDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem('businessData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.customers) setCustomers(data.customers);
        if (data.sales) setSales(data.sales);
        if (data.services) setServices(data.services);
        if (data.coupons) setCoupons(data.coupons);
        if (data.staff) setStaff(data.staff);
        if (data.inventory) setInventory(data.inventory);
        if (data.appointments) setAppointments(data.appointments);
        if (data.expenses) setExpenses(data.expenses);
        if (data.outlets) setOutlets(data.outlets);
        if (data.suppliers) setSuppliers(data.suppliers);
        if (data.loyaltyPrograms) setLoyaltyPrograms(data.loyaltyPrograms);
        if (data.settings) setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  const initializeMockData = () => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St, City, State 12345',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        services: ['Haircut', 'Beard Trim'],
        totalSpent: 1250.00,
        lastVisit: '2024-01-15',
        createdAt: '2024-01-01',
        visits: 15,
        averageSpend: 83.33,
        preferredServices: ['Haircut', 'Beard Trim'],
        notes: 'Preferred stylist: Mike',
        loyaltyPoints: 125,
        membershipTier: 'Gold',
        communicationPreferences: {
          sms: true,
          email: true,
          whatsapp: false
        },
        activityLog: [
          {
            id: 1,
            type: 'visit',
            description: 'Visited for haircut and beard trim',
            date: '2024-01-15T10:30:00Z',
            amount: 45.00
          }
        ]
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        phone: '+1234567891',
        email: 'sarah@example.com',
        address: '456 Oak Ave, City, State 12345',
        dateOfBirth: '1985-08-22',
        gender: 'Female',
        services: ['Hair Color', 'Cut & Style'],
        totalSpent: 850.00,
        lastVisit: '2024-01-18',
        createdAt: '2023-12-15',
        visits: 8,
        averageSpend: 106.25,
        preferredServices: ['Hair Color'],
        notes: 'Allergic to certain hair dyes',
        loyaltyPoints: 85,
        membershipTier: 'Silver',
        communicationPreferences: {
          sms: true,
          email: true,
          whatsapp: true
        },
        activityLog: [
          {
            id: 1,
            type: 'purchase',
            description: 'Hair coloring service',
            date: '2024-01-18T14:30:00Z',
            amount: 120.00
          }
        ]
      }
    ];

    const mockServices = [
      {
        id: 1,
        name: 'Premium Haircut',
        price: 35.00,
        gst: 18,
        category: 'Hair',
        variants: ['Regular', 'Premium', 'Deluxe'],
        description: 'Professional haircut with consultation',
        duration: 45,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=200&fit=crop',
        commission: 10,
        requirements: ['Hair washing station', 'Professional scissors'],
        skillLevel: 'Intermediate'
      },
      {
        id: 2,
        name: 'Hair Color Treatment',
        price: 120.00,
        gst: 18,
        category: 'Hair',
        variants: ['Single Color', 'Highlights', 'Full Color'],
        description: 'Professional hair coloring service',
        duration: 120,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1560004960-5c8c0e5b3ad0?w=300&h=200&fit=crop',
        commission: 15,
        requirements: ['Color mixing station', 'Professional dyes'],
        skillLevel: 'Advanced'
      },
      {
        id: 3,
        name: 'Beard Trim & Style',
        price: 25.00,
        gst: 18,
        category: 'Grooming',
        variants: ['Basic Trim', 'Style & Shape', 'Full Service'],
        description: 'Professional beard trimming and styling',
        duration: 30,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop',
        commission: 8,
        requirements: ['Trimmer set', 'Styling tools'],
        skillLevel: 'Beginner'
      }
    ];

    const mockInventory = [
      {
        id: 1,
        name: 'Professional Hair Shampoo',
        category: 'Hair Care',
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        unit: 'bottles',
        costPrice: 150,
        sellingPrice: 250,
        supplier: 'Beauty Supplies Co.',
        expiryDate: '2025-12-31',
        batchNumber: 'HS2024001',
        location: 'Storage Room A',
        barcode: '1234567890123',
        status: 'In Stock',
        lastRestocked: '2024-01-10',
        totalValue: 6750
      },
      {
        id: 2,
        name: 'Hair Color - Brown',
        category: 'Hair Color',
        currentStock: 8,
        minStock: 10,
        maxStock: 50,
        unit: 'tubes',
        costPrice: 300,
        sellingPrice: 450,
        supplier: 'Color Pro Ltd.',
        expiryDate: '2025-06-30',
        batchNumber: 'HC2024015',
        location: 'Color Station',
        barcode: '1234567890124',
        status: 'Low Stock',
        lastRestocked: '2024-01-05',
        totalValue: 2400
      }
    ];

    const mockAppointments = [
      {
        id: 1,
        customerId: 1,
        customerName: 'John Doe',
        serviceId: 1,
        serviceName: 'Premium Haircut',
        staffId: 1,
        staffName: 'Mike Johnson',
        date: '2024-01-20',
        time: '10:00',
        duration: 45,
        status: 'Confirmed',
        notes: 'Regular customer, prefers short sides',
        reminderSent: false,
        createdAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 2,
        customerId: 2,
        customerName: 'Sarah Wilson',
        serviceId: 2,
        serviceName: 'Hair Color Treatment',
        staffId: 2,
        staffName: 'Lisa Chen',
        date: '2024-01-21',
        time: '14:00',
        duration: 120,
        status: 'Confirmed',
        notes: 'Check for allergies before treatment',
        reminderSent: false,
        createdAt: '2024-01-16T09:15:00Z'
      }
    ];

    const mockStaff = [
      {
        id: 1,
        name: 'Mike Johnson',
        role: 'Senior Stylist',
        phone: '+1234567892',
        email: 'mike@salon.com',
        address: '456 Staff St, City, State',
        dateOfBirth: '1985-03-20',
        hireDate: '2020-01-15',
        salary: 35000,
        commissionRate: 15,
        outletId: 1,
        isActive: true,
        specialties: ['Haircuts', 'Beard Styling', 'Hair Coloring'],
        rating: 4.8,
        experience: 5,
        certifications: ['Professional Hairstylist', 'Color Specialist'],
        performance: {
          salesThisMonth: 15000,
          customersServed: 45,
          averageRating: 4.8,
          targetAchievement: 85
        }
      },
      {
        id: 2,
        name: 'Lisa Chen',
        role: 'Color Specialist',
        phone: '+1234567893',
        email: 'lisa@salon.com',
        address: '789 Color St, City, State',
        dateOfBirth: '1990-07-12',
        hireDate: '2021-03-01',
        salary: 32000,
        commissionRate: 18,
        outletId: 1,
        isActive: true,
        specialties: ['Hair Coloring', 'Highlights', 'Chemical Treatments'],
        rating: 4.9,
        experience: 3,
        certifications: ['Advanced Color Specialist', 'Chemical Treatment Expert'],
        performance: {
          salesThisMonth: 18000,
          customersServed: 35,
          averageRating: 4.9,
          targetAchievement: 92
        }
      }
    ];

    const mockExpenses = [
      {
        id: 1,
        category: 'Utilities',
        description: 'Monthly Electricity Bill',
        amount: 2500,
        date: '2024-01-15',
        paymentMethod: 'Bank Transfer',
        vendor: 'City Electric Company',
        receipt: null,
        status: 'Paid',
        recurring: true,
        recurringPeriod: 'Monthly',
        tags: ['Electricity', 'Utilities'],
        outletId: 1
      },
      {
        id: 2,
        category: 'Supplies',
        description: 'Hair Care Products Restock',
        amount: 5800,
        date: '2024-01-10',
        paymentMethod: 'Card',
        vendor: 'Beauty Supplies Co.',
        receipt: null,
        status: 'Paid',
        recurring: false,
        recurringPeriod: null,
        tags: ['Inventory', 'Hair Care'],
        outletId: 1
      }
    ];

    const mockSales = [
      {
        id: 1,
        customerId: 1,
        customerName: 'John Doe',
        invoiceNumber: 'INV-001234',
        date: '2024-01-15T10:30:00Z',
        services: [
          {
            serviceId: 1,
            serviceName: 'Premium Haircut',
            variant: 'Regular',
            price: 35.00,
            quantity: 1,
            total: 35.00
          }
        ],
        subtotal: 35.00,
        gst: 6.30,
        discount: 0,
        total: 41.30,
        paymentMethod: 'Cash',
        staffId: 1,
        staffName: 'Mike Johnson',
        status: 'Completed'
      },
      {
        id: 2,
        customerId: 2,
        customerName: 'Sarah Wilson',
        invoiceNumber: 'INV-001235',
        date: '2024-01-18T14:30:00Z',
        services: [
          {
            serviceId: 2,
            serviceName: 'Hair Color Treatment',
            variant: 'Highlights',
            price: 120.00,
            quantity: 1,
            total: 120.00
          }
        ],
        subtotal: 120.00,
        gst: 21.60,
        discount: 0,
        total: 141.60,
        paymentMethod: 'Card',
        staffId: 2,
        staffName: 'Lisa Chen',
        status: 'Completed'
      }
    ];

    if (!localStorage.getItem('businessData')) {
      setCustomers(mockCustomers);
      setServices(mockServices);
      setInventory(mockInventory);
      setAppointments(mockAppointments);
      setStaff(mockStaff);
      setExpenses(mockExpenses);
      setSales(mockSales);
      initializeNotifications();
    }
  };

  const initializeNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        title: 'Low Stock Alert',
        message: 'Hair Color - Brown is running low (8 units remaining)',
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'high',
        actionRequired: true,
        relatedEntity: 'inventory',
        entityId: 2
      },
      {
        id: 2,
        title: 'Upcoming Appointment',
        message: 'John Doe has an appointment tomorrow at 10:00 AM',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        actionRequired: false,
        relatedEntity: 'appointment',
        entityId: 1
      }
    ];
    setNotifications(mockNotifications);
  };

  // Enhanced CRUD operations
  const addCustomer = async (customerData) => {
    try {
      const newCustomer = {
        ...customerData,
        id: Date.now(),
        totalSpent: 0,
        visits: 0,
        loyaltyPoints: 0,
        membershipTier: 'Bronze',
        communicationPreferences: {
          sms: true,
          email: true,
          whatsapp: false
        },
        activityLog: [{
          id: 1,
          type: 'registration',
          description: 'Customer registered',
          date: new Date().toISOString()
        }],
        createdAt: new Date().toISOString()
      };

      setCustomers(prev => [...prev, newCustomer]);
      
      addNotification({
        title: 'New Customer Added',
        message: `${newCustomer.name} has been added to the system`,
        type: 'success',
        priority: 'low'
      });

      toast.success('Customer added successfully!');
      return newCustomer;
    } catch (error) {
      toast.error('Failed to add customer');
      throw error;
    }
  };

  const updateCustomer = (id, updates) => {
    try {
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
      toast.success('Customer updated successfully!');
    } catch (error) {
      toast.error('Failed to update customer');
      throw error;
    }
  };

  const deleteCustomer = (id) => {
    try {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast.success('Customer deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete customer');
      throw error;
    }
  };

  const addService = (serviceData) => {
    try {
      const newService = {
        ...serviceData,
        id: Date.now(),
        isActive: true,
        commission: serviceData.commission || 10,
        createdAt: new Date().toISOString()
      };

      setServices(prev => [...prev, newService]);
      
      addNotification({
        title: 'New Service Added',
        message: `${newService.name} has been added to the service menu`,
        type: 'success',
        priority: 'low'
      });

      toast.success('Service added successfully!');
      return newService;
    } catch (error) {
      toast.error('Failed to add service');
      throw error;
    }
  };

  const updateService = (id, updates) => {
    try {
      setServices(prev => 
        prev.map(service => 
          service.id === id ? { ...service, ...updates } : service
        )
      );
      toast.success('Service updated successfully!');
    } catch (error) {
      toast.error('Failed to update service');
      throw error;
    }
  };

  const deleteService = (id) => {
    try {
      setServices(prev => prev.filter(service => service.id !== id));
      toast.success('Service deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete service');
      throw error;
    }
  };

  const addInventoryItem = (itemData) => {
    try {
      const newItem = {
        ...itemData,
        id: Date.now(),
        status: itemData.currentStock <= itemData.minStock ? 'Low Stock' : 'In Stock',
        totalValue: itemData.currentStock * itemData.costPrice,
        createdAt: new Date().toISOString()
      };

      setInventory(prev => [...prev, newItem]);
      
      if (newItem.status === 'Low Stock') {
        addNotification({
          title: 'Low Stock Alert',
          message: `${newItem.name} is running low (${newItem.currentStock} units remaining)`,
          type: 'warning',
          priority: 'high',
          actionRequired: true,
          relatedEntity: 'inventory',
          entityId: newItem.id
        });
      }

      toast.success('Inventory item added successfully!');
      return newItem;
    } catch (error) {
      toast.error('Failed to add inventory item');
      throw error;
    }
  };

  const updateInventoryItem = (id, updates) => {
    try {
      setInventory(prev => 
        prev.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, ...updates };
            updatedItem.status = updatedItem.currentStock <= updatedItem.minStock ? 'Low Stock' : 'In Stock';
            updatedItem.totalValue = updatedItem.currentStock * updatedItem.costPrice;
            
            if (updatedItem.status === 'Low Stock' && item.status !== 'Low Stock') {
              addNotification({
                title: 'Low Stock Alert',
                message: `${updatedItem.name} is running low (${updatedItem.currentStock} units remaining)`,
                type: 'warning',
                priority: 'high',
                actionRequired: true,
                relatedEntity: 'inventory',
                entityId: updatedItem.id
              });
            }
            
            return updatedItem;
          }
          return item;
        })
      );
      toast.success('Inventory item updated successfully!');
    } catch (error) {
      toast.error('Failed to update inventory item');
      throw error;
    }
  };

  const addAppointment = (appointmentData) => {
    try {
      const newAppointment = {
        ...appointmentData,
        id: Date.now(),
        status: 'Confirmed',
        reminderSent: false,
        createdAt: new Date().toISOString()
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      addNotification({
        title: 'New Appointment Booked',
        message: `${appointmentData.customerName} booked ${appointmentData.serviceName} for ${appointmentData.date}`,
        type: 'info',
        priority: 'medium',
        relatedEntity: 'appointment',
        entityId: newAppointment.id
      });

      toast.success('Appointment booked successfully!');
      return newAppointment;
    } catch (error) {
      toast.error('Failed to book appointment');
      throw error;
    }
  };

  const updateAppointment = (id, updates) => {
    try {
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, ...updates } : appointment
        )
      );
      toast.success('Appointment updated successfully!');
    } catch (error) {
      toast.error('Failed to update appointment');
      throw error;
    }
  };

  const addStaff = (staffData) => {
    try {
      const newStaff = {
        ...staffData,
        id: Date.now(),
        isActive: true,
        performance: {
          salesThisMonth: 0,
          customersServed: 0,
          averageRating: 0,
          targetAchievement: 0
        },
        createdAt: new Date().toISOString()
      };

      setStaff(prev => [...prev, newStaff]);
      
      addNotification({
        title: 'New Staff Member Added',
        message: `${newStaff.name} has been added to the team`,
        type: 'success',
        priority: 'low'
      });

      toast.success('Staff member added successfully!');
      return newStaff;
    } catch (error) {
      toast.error('Failed to add staff member');
      throw error;
    }
  };

  const addSale = (saleData) => {
    try {
      const newSale = {
        ...saleData,
        id: Date.now(),
        invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
        date: new Date().toISOString(),
        status: 'Completed'
      };

      setSales(prev => [...prev, newSale]);

      if (saleData.customerId) {
        const customer = customers.find(c => c.id === saleData.customerId);
        if (customer) {
          const loyaltyPointsEarned = Math.floor(saleData.total * settings.loyaltyPointsRate);
          
          updateCustomer(saleData.customerId, {
            totalSpent: customer.totalSpent + saleData.total,
            lastVisit: new Date().toISOString().split('T')[0],
            visits: customer.visits + 1,
            loyaltyPoints: (customer.loyaltyPoints || 0) + loyaltyPointsEarned
          });

          addCustomerActivity(saleData.customerId, {
            type: 'purchase',
            description: `Purchase completed - ${newSale.invoiceNumber}`,
            amount: saleData.total
          });
        }
      }

      addNotification({
        title: 'Sale Completed',
        message: `Sale ${newSale.invoiceNumber} completed for ₹${saleData.total.toFixed(2)}`,
        type: 'success',
        priority: 'low'
      });

      toast.success(`Sale completed! Invoice: ${newSale.invoiceNumber}`);
      return newSale;
    } catch (error) {
      toast.error('Failed to process sale');
      throw error;
    }
  };

  const addCoupon = (couponData) => {
    try {
      const newCoupon = {
        ...couponData,
        id: Date.now(),
        usedCount: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      setCoupons(prev => [...prev, newCoupon]);
      
      addNotification({
        title: 'New Coupon Created',
        message: `Coupon ${newCoupon.code} has been created`,
        type: 'success',
        priority: 'low'
      });

      toast.success('Coupon created successfully!');
      return newCoupon;
    } catch (error) {
      toast.error('Failed to create coupon');
      throw error;
    }
  };

  const updateCoupon = (id, updates) => {
    try {
      setCoupons(prev => 
        prev.map(coupon => 
          coupon.id === id ? { ...coupon, ...updates } : coupon
        )
      );
      toast.success('Coupon updated successfully!');
    } catch (error) {
      toast.error('Failed to update coupon');
      throw error;
    }
  };

  const validateCoupon = (code, amount) => {
    try {
      const coupon = coupons.find(c => c.code === code && c.isActive);
      
      if (!coupon) return { valid: false, message: 'Invalid coupon code' };
      
      if (coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: 'Coupon usage limit exceeded' };
      }
      
      if (new Date() > new Date(coupon.endDate)) {
        return { valid: false, message: 'Coupon has expired' };
      }
      
      if (amount < coupon.minAmount) {
        return { valid: false, message: `Minimum order amount is ₹${coupon.minAmount}` };
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = Math.min((amount * coupon.value) / 100, coupon.maxDiscount);
      } else {
        discount = Math.min(coupon.value, coupon.maxDiscount);
      }

      return { valid: true, discount, coupon };
    } catch (error) {
      return { valid: false, message: 'Error validating coupon' };
    }
  };

  const addNotification = (notification) => {
    try {
      const newNotification = {
        ...notification,
        id: Date.now(),
        read: false,
        createdAt: new Date().toISOString(),
        actionRequired: notification.actionRequired || false,
        priority: notification.priority || 'low'
      };

      setNotifications(prev => [newNotification, ...prev]);
      
      if (notification.priority === 'high') {
        toast.error(notification.title);
      } else if (notification.type === 'success') {
        toast.success(notification.title);
      }
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addCustomerActivity = (customerId, activity) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId ? {
          ...customer,
          activityLog: [
            {
              ...activity,
              id: Date.now(),
              date: new Date().toISOString()
            },
            ...(customer.activityLog || [])
          ]
        } : customer
      )
    );
  };

  const updateSettings = (newSettings) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      throw error;
    }
  };

  const getAnalytics = () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const todaySales = sales.filter(sale => 
      new Date(sale.date).toDateString() === today.toDateString()
    );

    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const monthlyRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    const dailyRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      dailyRevenue,
      totalSales: sales.length,
      monthlySales: monthSales.length,
      dailySales: todaySales.length,
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.lastVisit).length,
      averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
      topServices: services.sort((a, b) => b.price - a.price).slice(0, 5),
      lowStockItems: inventory.filter(item => item.currentStock <= item.minStock),
      upcomingAppointments: appointments.filter(apt => 
        new Date(apt.date) >= today && apt.status === 'Confirmed'
      ).length
    };
  };

  const value = {
    // Data
    customers, sales, services, coupons, staff, inventory, appointments, 
    expenses, notifications, outlets, suppliers, loyaltyPrograms, templates, settings,
    
    // Customer operations
    addCustomer, updateCustomer, deleteCustomer, addCustomerActivity,
    
    // Service operations  
    addService, updateService, deleteService,
    
    // Sales operations
    addSale, updateSale: (id, updates) => setSales(prev => prev.map(sale => sale.id === id ? {...sale, ...updates} : sale)),
    deleteSale: (id) => setSales(prev => prev.filter(sale => sale.id !== id)),
    
    // Inventory operations
    addInventoryItem, updateInventoryItem,
    deleteInventoryItem: (id) => setInventory(prev => prev.filter(item => item.id !== id)),
    
    // Appointment operations
    addAppointment, updateAppointment,
    deleteAppointment: (id) => setAppointments(prev => prev.filter(apt => apt.id !== id)),
    
    // Staff operations
    addStaff, updateStaff: (id, updates) => setStaff(prev => prev.map(staff => staff.id === id ? {...staff, ...updates} : staff)),
    deleteStaff: (id) => setStaff(prev => prev.filter(staff => staff.id !== id)),
    
    // Expense operations
    addExpense: (expense) => setExpenses(prev => [...prev, {...expense, id: Date.now()}]),
    updateExpense: (id, updates) => setExpenses(prev => prev.map(exp => exp.id === id ? {...exp, ...updates} : exp)),
    deleteExpense: (id) => setExpenses(prev => prev.filter(exp => exp.id !== id)),
    
    // Coupon operations
    addCoupon, updateCoupon, validateCoupon,
    deleteCoupon: (id) => setCoupons(prev => prev.filter(coupon => coupon.id !== id)),
    
    // Notification operations
    addNotification, markNotificationAsRead, deleteNotification,
    
    // Settings
    updateSettings,
    
    // Analytics
    getAnalytics,
    
    // Utility functions
    saveDataToStorage,
    loadDataFromStorage
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};