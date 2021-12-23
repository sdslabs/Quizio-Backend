import GoogleDefaultExport from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();
const GoogleStrategy = GoogleDefaultExport.OAuth2Strategy;
const clientID = process.env.GOOGLECLIENTID;
const clientSecret = process.env.GOOGLECLIENTSECRET;
const callbackURL = process.env.GOOGLECALLBACKURL;

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
				clientID,
				clientSecret,
				callbackURL,
			},
			(accessToken, refreshToken, profile, done) => done(null, {
				profile,
				accessToken,
			}),
		),
	);
};

export default googleOauth;
