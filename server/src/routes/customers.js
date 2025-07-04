import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { branchAccess } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get customers for a branch
router.get('/branch/:branchId', branchAccess, async (req, res) => {
  try {
    const { branchId } = req.params;
    const { search, page = 1, limit = 20 } = req.query;

    const where = {
      branchId: parseInt(branchId),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          _count: {
            select: {
              appointments: true,
              sales: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        branch: true,
        appointments: {
          include: {
            services: {
              include: {
                service: true
              }
            },
            staff: {
              include: {
                staff: true
              }
            }
          },
          orderBy: { date: 'desc' },
          take: 10
        },
        sales: {
          include: {
            items: {
              include: {
                service: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check branch access
    if (req.user.role !== 'ADMIN' && req.user.branchId !== customer.branchId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create customer
router.post('/', [
  body('name').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('branchId').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { branchId, ...customerData } = req.body;

    // Check branch access
    if (req.user.role !== 'ADMIN' && req.user.branchId !== parseInt(branchId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        branchId: parseInt(branchId)
      }
    });

    // Emit real-time update
    req.io.to(`branch-${branchId}`).emit('customer-created', customer);

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update customer
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('phone').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Get customer to check branch access
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check branch access
    if (req.user.role !== 'ADMIN' && req.user.branchId !== existingCustomer.branchId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Emit real-time update
    req.io.to(`branch-${customer.branchId}`).emit('customer-updated', customer);

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer to check branch access
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check branch access
    if (req.user.role !== 'ADMIN' && req.user.branchId !== customer.branchId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.customer.delete({
      where: { id: parseInt(id) }
    });

    // Emit real-time update
    req.io.to(`branch-${customer.branchId}`).emit('customer-deleted', { id: parseInt(id) });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;