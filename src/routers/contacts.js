import {Router} from "express";

import * as contactControllers from "../controllers/contacts.js";

import isValidId from "../middlewares/isValidId.js";

import validateBody from "../untils/validateBody.js";
import ctrlWrapper from "../untils/ctrlWrapper.js";

import { contactAddSchema, contactPatchSchema } from "../validation/contacts.js";

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(contactControllers.getAllContactController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(contactControllers.getContactByIdController));

contactsRouter.post("/", validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.put("/:id", isValidId, validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

contactsRouter.patch("/:id", isValidId, validateBody(contactPatchSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;