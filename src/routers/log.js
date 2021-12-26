import express from 'express';

import {
	isAuth, isSuperAdmin,
} from '../helpers/authorizer';
import controller from '../controllers/log';

const router = express.Router();

router.get('/', isAuth, isSuperAdmin, controller.getAllLogs);
export default router;
