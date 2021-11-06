class HttpException extends Error {
  status: number;
  message: string;
  code?: number;
  data?: any;
  constructor(status: number, message: string, code?: number, data?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
    this.data = data;
  }
}

export default HttpException;
