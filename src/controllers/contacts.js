import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationParams from '../untils/parsePaginationParams.js';
import parseSortParams from '../untils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';
import saveFileToUploadDir from '../untils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../untils/saveFileToCloudinary.js';
import { env } from '../untils/env.js';

const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res, next) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const { _id: userId } = req.user;

  const data = await contactServices.getAllContacts({
    userId,
    perPage,
    page,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);
  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  let photo;
  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }
  const { _id: userId } = req.user;
  const data = await contactServices.createContact({
    ...req.body,
    userId,
    photo,
  });
  res.status(201).json({
    status: 201,
    message: 'Contact add successfully',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await contactServices.updateContact(
    { _id: id, userId },
    req.body,
    { upsert: true },
  );

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: isNew
      ? 'Contact created successfully'
      : 'Contact updated successfully',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await contactServices.updateContact(
    { _id: id, userId },
    req.body,
  );

  if (!result) {
    throw createHttpError(404, `Contact whith id=${id} not found`);
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id: id, userId });
  if (!data) {
    throw createHttpError(404, `Contact whith id=${id} not found`);
  }
  res.status(204).send();
};