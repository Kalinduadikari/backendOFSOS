class CustomError extends Error {
    constructor(statusCode, message, errorCode, details, stack) {
      super();
      this.name = 'CustomError';
      this.statusCode = statusCode;
      this.message = message;
      this.errorCode = errorCode;
      this.details = details;
      this.stack = stack || new Error().stack;
    }
  }
  
  export default CustomError;
  