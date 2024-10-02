import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});