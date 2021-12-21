import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
	/** Unique Username to identify every user */
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
	/** date on which the user was added */
	dateAdded: {
		type: Date,
		default: Date.now,
	},
	quizzes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			role: String,
		},
	],
});

export default mongoose.model('User', userSchema);
