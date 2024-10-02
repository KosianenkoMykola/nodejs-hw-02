import createHttpError from 'http-errors';

const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errorMessage = error.details
        .map((err) => err.message.replace(/"/g, ''))
        .join(', ');

      const validateError = createHttpError(400, errorMessage);
      next(validateError);
    }
  };
  return func;
};

export default validateBody;