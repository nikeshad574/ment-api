class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public errors: any[] = [],
    public stack: string = ""
  ) {
    super(message);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
