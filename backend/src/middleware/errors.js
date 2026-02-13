function notFound(req, res, next) {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const body = { message: err.message || "Server error" };
  if (process.env.NODE_ENV !== "production") body.stack = err.stack;
  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };