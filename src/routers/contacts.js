import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactsController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactsController));

router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
