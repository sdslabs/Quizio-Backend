/* npm packages */
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import mongoSanitize from 'express-mongo-sanitize';

/* Misc */
import { notFoundResponse } from './helpers/responses';
import googleOauth from './services/googleOauth';
import githubOauth from './services/githubOauth';

/* Import Routers */
import authRouter from './routers/auth';
import staticRouter from './routers/static';
import userRouter from './routers/users';
import quizRouter from './routers/quiz';
import registerRouter from './routers/register';

/* Initialize */
dotenv.config();
const app = express();
const { CLIENT_HOME_PAGE_URL } = process.env;
const corsOptions = {
	origin: CLIENT_HOME_PAGE_URL,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
};

/* Middlewares */
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(passport.initialize());

/* AUTH */
googleOauth(passport);
githubOauth(passport);

/* Routes */
app.get('/', staticRouter);
app.use('/api/v2/auth', authRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/quizzes', quizRouter);
app.use('/api/v2/register', registerRouter);
app.use('*', (req, res) => notFoundResponse(res, 'Endpoint does not exist or has been removed!'));

export default app;
