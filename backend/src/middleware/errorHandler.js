function errorHandler(err, req, res, next) {
  console.error('Error:', err);

<<<<<<< HEAD
  if (err.name === 'ValidationError' && err.errors) {
=======
  if (err.name === 'ValidationError') {
>>>>>>> f0b1ebd36e96d97161eb04c8748b2ad53a6d8e57
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

<<<<<<< HEAD
  if (err.name === 'TokenExpiredError') {
=======
  if (error.name === 'TokenExpiredError') {
>>>>>>> f0b1ebd36e96d97161eb04c8748b2ad53a6d8e57
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { errorHandler };