import express from 'express';
import multer from 'multer';
import controller from '../controllers/utils';
import { isAuth } from '../helpers/authorizer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/verifyQuizioID/:id', isAuth, controller.verifyQuizioID); // DONE
router.post('/images', [isAuth, upload.single('image')], controller.uploadImage);

export default router;
