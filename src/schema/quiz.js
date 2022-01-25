import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema for every quiz */
const quizSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** Name of the quiz */
	name: String,
	/** Description of the quiz */
	description: String,
	/** Instructions of the quiz */
	instructions: String,
	/** The date and time on which the quiz was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Username of the creator of the quiz. */
	creator: {
		type: String,
		ref: 'User',
		required: true,
	},
	/** Usernames of the people managing the quiz (quiz creators and checkers) */
	owners: [{
		type: String,
		ref: 'User',
	}],
	/** Timestamp of the first moment when the quiz can be started */
	startTime: Date,
	/** Timestamp of the moment when the quiz ends */
	endTime: Date,
	/** The window(in seconds) in which quiz can be started after the startTime */
	startWindow: Number,
	/** Code to be able to access the quiz (for quiz givers) */
	accessCode: String,

	/* Additional details for the quiz */
	detail1: {
		key: String,
		value: String,
	},
	/* Additional details for the quiz */
	detail2: {
		key: String,
		value: String,
	},
	/* Additional details for the quiz */
	detail3: {
		key: String,
		value: String,
	},
	/** Sections in the quiz */
	sections: [
		{
			type: String,
			ref: 'Section',
		},
	],
});

export default mongoose.model('Quiz', quizSchema);
