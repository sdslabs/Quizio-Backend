import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/response';

const router = express.Router();

router.get('/', isAuth, controller.getResponse); // DONE
router.put('/', isAuth, controller.saveResponse); // DONE

export default router;
