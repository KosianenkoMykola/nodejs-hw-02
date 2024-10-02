const errorHandler = (error, req, res, next) => {
    const statusCode = error.status || 500;
  
    res.status(statusCode).json({
      status: statusCode,
      message: statusCode === 500 ? 'Something went wrong' : error.message,
    });
  };
  export default errorHandler;