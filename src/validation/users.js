import Joi from "joi";

import { emailRegexp } from "../constants/users.js";

export const userSignupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

export const resetPwdSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
});
