import {Schema, model} from "mongoose";

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
        enum: ["work", "home", "personal"],
        default: "personal",
        required: true,
    }
}, {versionKey: false, timestamps: true});

const ContactCollection = model("contact", ContactSchema);

export default ContactCollection;