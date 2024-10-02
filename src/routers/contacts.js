import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';

import authenticate from '../middlewares/authenticate.js';
import ctrlWrapper from '../untils/ctrlWrapper.js';
import validateBody from '../untils/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';
import upload from '../middlewares/upload.js';


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactControllers.getAllContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(contactControllers.getContactByIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.put('/:id', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;