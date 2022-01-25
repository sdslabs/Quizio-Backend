import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema for every user */
const userSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** Unique Username to identify every user
	 * (TODO: user quizioID for internal purposes and email for client side)
	 * */
	username: {
		type: String,
		required: true,
		unique: true,
	},

	/** Unique Email to identify every user */
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
	instiName: String,
	country: String,
	city: String,
	phoneNumber: String,
	handle1: String,
	handle2: String,
	handle3: String,
	/** date on which the user was added */

	instiName: String,
	country: String,
	City: String,
	phoneNumber: String,

	handle1: String,
	handle2: String,
	handle3: String,

	dateAdded: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('User', userSchema);
