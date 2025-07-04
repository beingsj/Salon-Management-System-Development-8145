import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authorize } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all branches (Admin only)
router.get('/', authorize('ADMIN'), async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: {
            staff: true,
            customers: true,
            appointments: true,
            sales: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ branches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single branch
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check permissions
    if (req.user.role !== 'ADMIN' && req.user.branchId !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await prisma.branch.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true
          }
        },
        services: {
          include: {
            service: true
          }
        },
        _count: {
          select: {
            customers: true,
            appointments: true,
            sales: true
          }
        }
      }
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json({ branch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create branch (Admin only)
router.post('/', [
  authorize('ADMIN'),
  body('name').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('pincode').notEmpty().trim(),
  body('gstin').notEmpty().trim(),
  body('managerName').notEmpty().trim(),
  body('managerPhone').notEmpty().trim(),
  body('managerEmail').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const branchData = req.body;
    
    const branch = await prisma.branch.create({
      data: branchData
    });

    // Emit real-time update
    req.io.emit('branch-created', branch);

    res.status(201).json({
      message: 'Branch created successfully',
      branch
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'GSTIN already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update branch
router.put('/:id', [
  authorize('ADMIN', 'BRANCH_MANAGER'),
  body('name').optional().notEmpty().trim(),
  body('address').optional().notEmpty().trim(),
  body('managerEmail').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check permissions
    if (req.user.role === 'BRANCH_MANAGER' && req.user.branchId !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await prisma.branch.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Emit real-time update
    req.io.emit('branch-updated', branch);

    res.json({
      message: 'Branch updated successfully',
      branch
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete branch (Admin only)
router.delete('/:id', authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.branch.delete({
      where: { id: parseInt(id) }
    });

    // Emit real-time update
    req.io.emit('branch-deleted', { id: parseInt(id) });

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;