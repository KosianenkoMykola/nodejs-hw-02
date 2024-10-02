import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../untils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  userId,
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
}) => {
  const skip = (page - 1) * perPage;

  const data = await ContactCollection.find({ userId })
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const count = await ContactCollection.find({ userId }).countDocuments();

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    data,
    page,
    perPage,
    totalItems: count,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);