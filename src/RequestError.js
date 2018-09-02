export default class RequestError extends Error {
  constructor(httpStatus, httpStatusMessage) {
    const message = `Failed before reaching FM Data API! HTTP Status ${httpStatus}-${httpStatusMessage}`;
    super(message);
    this.message = message;
    this.httpStatus = httpStatus;
    this.name = "RequestError";
  }
}
