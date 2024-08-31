import getAllContacts from "./getAllContacts.js";
import updateContacts from "./updateContacts.js";
import {createFakeContact} from "../utils/createFakeContact.js";

const generateContacts = async (number) => {
    const contactList = await getAllContacts();
    const newContactList = Array(number).fill(0).map(createFakeContact);
    contactList.push(...newContactList);
    await updateContacts(contactList);
};

generateContacts(5);
