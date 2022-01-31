import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/submit';

const router = express.Router();

router.post('/quiz/:quizID', isAuth, controller.SubmitUser);

export default router;
