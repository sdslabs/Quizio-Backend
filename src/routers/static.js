import path from 'path';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(path.resolve(), './static/index.html'));
});

export default router;
