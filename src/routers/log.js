import express from 'express';

import {
	isAuth, isSelf, isSuperAdmin,
} from '../helpers/authorizer';
import controller from '../controllers/log';

const router = express.Router();

router.get('/', isAuth, isSuperAdmin, controller.getAllLogs);
router.get('/:username', isAuth, isSelf, controller.getLogsForUser);
router.put('/:username', isAuth, isSelf, controller.updateLog);
export default router;
