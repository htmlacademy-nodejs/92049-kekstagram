class ValidationError extends Error {
  constructor(errors) {
    super(`Validation error`);
    this.code = 400;
    this.errors = errors;
  }
}

module.exports = ValidationError;
