import { Schema, model } from 'mongoose';
import { enumList } from '../../constants/contacts.js';
import { handleSaveError } from './hooks.js';


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name must be exist'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'phoneNumber must be exist'],
    },
    email: {
      type: String,
      required: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      require: [true, 'isFavorite must be exist'],
    },
    contactType: {
      type: String,
      enum: enumList,
      required: [true, 'contactType must be exist'],
      default: 'personal',
    },
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);

const ContactCollection = model('contact', contactSchema);

export const sortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavorite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export default ContactCollection;