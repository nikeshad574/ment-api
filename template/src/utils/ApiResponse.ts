class ApiResponse {
  constructor(
    public statusCode: number,
    public data: any,
    public message: string = statusCode < 400 ? "Success" : "Failed"
  ) {}
}

export default ApiResponse;
