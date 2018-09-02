import FMDapiError from "./FMdapiError";

import makeDebug from "debug";
import RequestError from "./RequestError";
const debug = makeDebug("fmdapi: handler");

export const fmResponseHandler = response => {
  const httpStatus = response.status;
  const httpStatusMsg = response.statusText;

  if (!response.data.messages) {
    //this is a generic http error, it never got to the the FM Data API
    throw new RequestError(httpStatus, httpStatusMsg);
  }

  const fmMsg = response.data.messages[0];
  const fmErrorCode = fmMsg.code;
  if (fmErrorCode !== "0") {
    throw new FMDapiError(
      `FMError ${fmErrorCode}: ${fmMsg.message}`,
      fmErrorCode,
      httpStatus
    );
  }
  return response.data;
};
