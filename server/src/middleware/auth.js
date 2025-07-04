import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { branch: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

export const branchAccess = (req, res, next) => {
  const { branchId } = req.params;
  
  // Admin can access all branches
  if (req.user.role === 'ADMIN') {
    return next();
  }
  
  // Staff and managers can only access their own branch
  if (req.user.branchId && req.user.branchId.toString() === branchId) {
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied. You can only access your assigned branch.' 
  });
};