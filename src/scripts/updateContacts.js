import * as fs from "node:fs/promises";
import { PATH_DB } from "../constants/contacts.js";

const updateContacts = contact => fs.writeFile(PATH_DB, JSON.stringify(contact, null, 2));

export default updateContacts;