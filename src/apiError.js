const { AxiosError } = require("axios");

class ApiError {
  constructor(status, name, message) {
    this.name = name;
    this.status = status;
    this.message = message;
  }

  static BadRequest(message) {
    return new ApiError(400, "Bad Request", message);
  }

  static TimeoutError(message) {
    return new ApiError(503, "Timeout", message);
  }

  static DomainError(err) {
    if (err instanceof AxiosError) {
      return new ApiError(
        err.response?.status || 503,
        "DomainServiceError",
        err.response?.data?.message || "Domain Service Unavailable"
      );
    }

    return new ApiError(500, "ServiceError", err.message);
  }
}

module.exports = ApiError;
