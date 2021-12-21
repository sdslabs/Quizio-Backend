import mongoose from 'mongoose';
import sectionSchema from './section';

const { Schema } = mongoose;

const quizSchema = new Schema({
	/** Title of the quiz */
	title: {
		type: String,
	},
	/** Description of the quiz */
	description: {
		type: String,
	},
	/** Instructions of the quiz */
	instructions: {
		type: String,
	},
	/** The date on which the quiz was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Username of the creator of the quiz.
	 * 1. Must exist in the `users` document
	 * 2. The user must have `superadmin` or `admin` or `staff` role
	*/
	creator: {
		type: String,
		ref: 'User',
		// required: true,
	},
	/** Usernames of the people added to the quiz.
	 * 1. Must exist in the `users` document
	 * 2. The user must have `superadmin` or `admin` or `staff` role
	*/
	owners: [{
		type: String,
		ref: 'User',
	}],
	/** The first time when the quiz can be started */
	startTime: {
		type: Date,
		// required: true,
	},
	/** The last time when the quiz can be started */
	endTime: {
		type: Date,
		// required: true,
	},
	/** The duration of the quiz */
	duration: {
		type: Date,
		// required: true,
	},
	/** Code to be able to access the quiz
	 * 1. Must be securely hashed before storing in db using a one-way hash
	 */
	accessCode: {
		type: String,
	},
	/** Is the access code needed to access the quiz? */
	needAccessCode: {
		type: Boolean,
	},
	/** Is the quiz publically available? */
	isPublic: {
		type: Boolean,
		default: false,
	},
	/** Sections in the quiz */
	sections: [sectionSchema],
	/** ObjectIds of registered users for the quiz */
	registrants: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});

export default mongoose.model('Quiz', quizSchema);
