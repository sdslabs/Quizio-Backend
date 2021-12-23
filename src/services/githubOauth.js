import GithubDefaultExport from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

const GithubStrategy = GithubDefaultExport.Strategy;

const githubOauth = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.githubClientID,
				clientSecret: process.env.githubClientSecret,
				callbackURL: process.env.githubCallbackURL,
			},
			(accessToken, refreshToken, profile, done) => done(null, profile),
		),
	);
};

export default githubOauth;
