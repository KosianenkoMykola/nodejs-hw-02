import {Schema, model} from "mongoose";
import {contactList} from "../../constants/contacts.js";

import { handleSaveError, setUpdateOptions } from "./hooks.js";

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: String,
    isFavourite: {
        type: Boolean,
        default: false,
        required: true,
    },
    contactType: {
        type: String,
        enum: contactList,
        default: "personal",
        required: true,
    },
    photo: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {versionKey: false, timestamps: true});

ContactSchema.post("save", handleSaveError);

ContactSchema.pre("findOneAndUpdate", setUpdateOptions);

ContactSchema.post("findOneAndUpdate", handleSaveError);

const ContactCollection = model("contact", ContactSchema);

export const sortFields = ["name", "phoneNumber", "email", "isFavourite", "contactType", "createdAt", "updatedAt"];

export default ContactCollection;