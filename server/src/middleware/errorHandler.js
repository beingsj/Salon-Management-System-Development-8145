export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.details?.map(detail => detail.message) || [error.message]
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({
      message: 'Duplicate entry',
      field: error.meta?.target?.[0] || 'unknown'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found'
    });
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};