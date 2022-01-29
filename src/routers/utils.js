import express from 'express';

import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/utils';

const router = express.Router();

router.get('/verifyQuizioID/:id', isAuth, controller.verifyQuizioID); // DONE
export default router;
