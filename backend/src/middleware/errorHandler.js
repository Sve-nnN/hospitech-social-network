// Global error handler
export const errorHandler = (err, req, res, next) => {
  // Mongoose duplicate key error
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ msg: `Valor duplicado para campo(s): ${field}` });
  }

  // Default: internal server error
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};

export default errorHandler;
