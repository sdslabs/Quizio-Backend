import express from 'express';
import passport from 'passport';
import oauthController, { googleOauth, githubOauth } from '../controllers/Oauth';
import { isAuth } from '../helpers/authorizer';

const router = express.Router();

router.get('/', (req, res) => res.send('<h1>auth home!</h1>'));
router.get('/fail', (req, res) => res.send('Log in Failed with an unknown error :('));

/* Signup with google */
router.get('/google', googleOauth.signUp());
router.get('/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/api/v2/auth/fail',
	}),
	googleOauth.signUpCallback);

/* Signup with github */
router.get('/github', githubOauth.signUp());
router.get('/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/api/v2/auth/fail',
	}),
	githubOauth.signUpCallback);

/* Protected route for testing */
router.get('/protected', isAuth, (req, res) => res.status(200).json({ message: `Welcome the the club! @${req.user.username}` }));

/* Logout */
router.get('/login', oauthController.login);
router.get('/logout', isAuth, oauthController.logout);

export default router;
