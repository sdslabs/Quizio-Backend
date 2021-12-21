import mongoose from 'mongoose';
import app from './src/app';
import logger from './src/helpers/logger';

const MONGOURI = process.env.mongoURI;
const port = process.env.PORT || 5050;

mongoose.connect(MONGOURI).then(() => logger
	.info('MongoDB successfully connected'))
	.catch((err) => logger.error(err));

app.listen(port, () => {
	logger.info(`Server is listening at http://localhost:${port}`);
});
