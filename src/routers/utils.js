import express from 'express';
import controller from '../controllers/utils';
import multer from 'multer';
import { isAuth } from '../helpers/authorizer';

// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/verifyQuizioID/:id', isAuth, controller.verifyQuizioID); // DONE

router.post('/uploadImage', [isAuth, upload.single('image')], controller.uploadImage);
export default router;
