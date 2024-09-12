import Joi from "joi";

import { contactList } from "../constans/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().required().messages({
        "any.required": "Phone number is required",
    }),
    email: Joi.string().email().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactList).required(),
});

export const contactPatchSchema = Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.number(),
    email: Joi.string(),
    isFavourite: Joi.boolean(),
    contactType: Joi.number().valid(...contactList)
});