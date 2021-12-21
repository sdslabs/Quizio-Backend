import mongoose from 'mongoose';

const { Schema } = mongoose;

const optionsSchema = new Schema({
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

const questionSchema = new Schema({
	/** Title of the question */
	title: {
		type: String,
	},
	/** Body of the question */
	body: {
		type: String,
	},
	/** Time when the question was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Username of the creator of the question.
	 * 1. Must exist in the `users` document
	 * 2. The user must have `superadmin` or `admin` or `staff` role
	*/
	creator: {
		type: String,
		ref: 'User',
		required: true,
	},
	/** Array of the authors who worked on the question */
	authors: [{ type: String, ref: 'User' }],
	/** Correct answer of the question
	 * 1. cannot have a string answer for MCQs
	*/
	answer: {
		type: String,
	},
	/** is the question an MCQ? */
	isMCQ: {
		type: Boolean,
		default: false,
	},
	/** Options for the answer
	 * 1. Only when the question is an MCQ
	*/
	options: [{ optionsSchema }],
	/** Can the question be autochecked? */
	autocheck: {
		type: Boolean,
		default: false,
	},
});

export default questionSchema;
