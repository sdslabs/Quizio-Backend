import GoogleDefaultExport from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();
const GoogleStrategy = GoogleDefaultExport.OAuth2Strategy;

const googleOauth = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
	passport.use(
		new GoogleStrategy(
			{
				// clientID: process.env.googleClientID,
				// clientSecret: process.env.googleClientSecret,
				// callbackURL: process.env.googleCallbackURL,
				clientID: process.env.GOOGLECLIENTID,
				clientSecret: process.env.GOOGLECLIENTSECRET,
				callbackURL: process.env.GOOGLECALLBACKURL,
			},
			(accessToken, refreshToken, profile, done) => done(null, {
				profile,
				accessToken,
			}),
		),
	);
};

export default googleOauth;
