import express from 'express';
import passport from 'passport';
import oauthController, { googleOauth, githubOauth } from '../controllers/Oauth';
import { isAuth } from '../helpers/authorizer';

const router = express.Router();

router.get('/', (req, res) => res.send('<h1>auth home!</h1>'));
router.get('/fail', (req, res) => res.send('Log in Failed with an unknown error :('));

/* Signup with google */
router.get('/google', googleOauth.signUp());
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/api/v2/auth/fail',
	}),
	googleOauth.signUpCallback,
);

/* Signup with github */
router.get('/github', githubOauth.signUp());
router.get(
	'/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/api/v2/auth/fail',
	}),
	githubOauth.signUpCallback,
);

/* Protected route for testing */
router.get('/protected', isAuth, (req, res) => res.status(200).json({ message: `Welcome to Quizio! @${req.user.username}` }));

/* Login using jwtToken (query params) */
router.get('/login', oauthController.login);
/* Login using jwtToken (unsafe cookie) */
router.get('/check', isAuth, oauthController.check);
router.get('/logout', isAuth, oauthController.logout);

export default router;
