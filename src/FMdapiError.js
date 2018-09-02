export default class FMDapiError extends Error {
  constructor(message, errorCode, httpStatus) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
    this.name = "FMDapiError";
  }
}
