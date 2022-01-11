import mongoose from 'mongoose';
import sectionSchema from './section';

const { Schema } = mongoose;

const quizSchema = new Schema({

	quizId: {
		type: String,
	},
	/** Name of the quiz */
	quizName: {
		type: String,
	},
	/** Description of the quiz */
	quizDesc: {
		type: String,
	},
	/** Instructions of the quiz */
	quizInst: {
		type: String,
	},
	/** The date on which the quiz was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Username of the creator of the quiz.
	 * 1. Must exist in the `users` document
	*/
	creator: {
		type: String,
		ref: 'User',
		// required: true,
	},
	/** Usernames of the people added to the quiz.
	 * 1. Must exist in the `users` document
	*/
	owners: [{
		type: String,
		ref: 'User',
	}],
	/** Timestamp of the first time when the quiz can be started */
	startTime: {
		type: Date,
		// required: true,
	},
	/** Timestamp of the last time when the quiz can be started */
	endTime: {
		type: Date,
		// required: true,
	},
	/** The duration of the quiz */
	examDuration: {
		type: Date,
		// required: true,
	},
	/** Code to be able to access the quiz
	 * 1. Must be securely hashed before storing in db using a one-way hash
	 */
	accessCode: {
		type: String,
	},

	/* Additional details for this particular quiz */
	detail1: {
		key: String,
		value: String,
	},
	/* Additional details for this particular quiz */
	detail2: {
		key: String,
		value: String,
	},
	/* Additional details for this particular quiz */
	detail3: {
		key: String,
		value: String,
	},

	/** Sections in the quiz */
	sections: [sectionSchema],

	/** ObjectIds of registered users for the quiz */
	registrants: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Registrant',
	}],
});

export default mongoose.model('Quiz', quizSchema);
