import GithubDefaultExport from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();
const GithubStrategy = GithubDefaultExport.Strategy;
const clientID = process.env.GITHUBCLIENTID;
const clientSecret = process.env.GITHUBCLIENTSECRET;
const callbackURL = '/api/v2/auth/github/callback';

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
				clientID,
				clientSecret,
				callbackURL,
			},
			(accessToken, refreshToken, profile, done) => done(null, profile),
		),
	);
};

export default githubOauth;
