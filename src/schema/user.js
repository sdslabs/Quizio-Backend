import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema for every user */
const userSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: {
		type: String,
		immutable: true,
	},

	/** Unique Username */
	username: {
		type: String,
		required: true,
		unique: true,
	},

	/** Unique Email id */
	email: {
		type: String,
		required: true,
		unique: true,
	},

	/**  Role determines the rights of every user */
	role: {
		type: String,
		enum: [
			'superadmin', // Can do everything
			'public', // Default role, can attempt quizzes
			'banned', // Cannot do anything at all on quizio
		],
		default: 'public',
	},
	/** url to the user's avatar on their github account */
	githubAvatar: String,
	/** url to the user's avatar on their google account */
	googleAvatar: String,
	/** github username of the user */
	githubUserName: String,
	/** first name of the user */
	firstName: String,
	/** last name of the user */
	lastName: String,
	/** instituition name of the user */
	instiName: String,
	/** country of the user */
	country: String,
	/** city of the user */
	city: String,
	/** phoneNumber of the user */
	phoneNumber: String,
	/** social handles of the user (3) */
	handle1: {
		key: String,
		value: String,
	},
	handle2: {
		key: String,
		value: String,
	},
	handle3: {
		key: String,
		value: String,
	},
	/** date on which the user was added */
	dateAdded: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('User', userSchema);
