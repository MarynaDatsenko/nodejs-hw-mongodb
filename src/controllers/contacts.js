import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';
import { deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById({ contactId, userId });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactsController = async (req, res) => {
  try {
    const contactData = {
      ...req.body,
    };

    if (req.file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        console.log('Uploading to Cloudinary...');
        contactData.photo = await saveFileToCloudinary(req.file);
      } else {
        console.log('Uploading locally...');
        contactData.photo = await saveFileToUploadDir(req.file);
      }
    }

    console.log('Contact data before saving:', contactData);

    const contact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    console.error('Error in createContactsController:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;

    console.log('Contact ID:', contactId);
    console.log('User ID:', req.user._id);
    console.log('File received:', photo);

    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        console.log('Uploading to Cloudinary...');
        photoUrl = await saveFileToCloudinary(photo);
        console.log('Uploaded to Cloudinary:', photoUrl);
      } else {
        console.log('Saving to local directory...');
        photoUrl = await saveFileToUploadDir(photo);
        console.log('Saved to local directory:', photoUrl);
      }
    }

    const payload = {
      ...req.body,
      photo: photoUrl,
    };

    console.log('Payload for update:', payload);

    const result = await updateContact(contactId, req.user._id, payload);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
