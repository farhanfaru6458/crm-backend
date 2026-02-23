const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;