
// create application user and collection
const dbUser = _getEnv('MONGO_USERNAME');
const dbPwd = _getEnv('MONGO_PASSWORD');
const dbName = _getEnv('MONGO_INITDB_DATABASE');

db.createUser({
	user: dbUser,
	pwd: dbPwd,
	roles: [
		{
			role: 'dbOwner',
			db: dbName,
		},
	],
});
