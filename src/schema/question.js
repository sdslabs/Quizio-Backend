import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema for every choice in a question */
const choicesSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** Body of the Option */
	body: {
		type: String,
		required: true,
	},
	/** Marks awarded for choosing this option (can be negetive) */
	marks: {
		type: Number,
		default: 0,
	},
	/** Does this option have to be chosen? (for MCQ all-in type questions) */
	isNeeded: {
		type: Boolean,
		default: false,
	},
});

/** Schema for every question */
const questionSchema = new Schema({
	/** Type of the question */
	type: {
		type: String,
		enum: ['mcq', 'subjective'],
		default: 'mcq',
	},
	/** Actual question text */
	question: String,

	/** is the question an MCQ? */
	isMCQ: {
		type: Boolean,
		default: false,
	},
	/** Choices (MCQ Only) */
	choices: [choicesSchema],
	/** Answer (MCQ Only) */
	answer: String,
	/** Notes for checkers */
	checkerNotes: String,
	/** Time when the question was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Username of the creator of the question.
	 * 1. Must exist in the `users` document
	 */
	creator: {
		type: String,
		ref: 'User',
		// required: true,
	},
	/** Minimum marks for Subjective questions */
	minMarks: Number,
	/** Maximum marks for Subjective questions */
	maxMarks: Number,
	/** Default marks for Subjective questions */
	defaultMarks: Number,
	/** Can the question be autochecked? */
	autocheck: {
		type: Boolean,
		default: true,
	},
});

export default mongoose.model('Question', questionSchema);
