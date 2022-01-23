import mongoose from 'mongoose';
import questionSchema from './question';

const { Schema } = mongoose;

const sectionSchema = new Schema({

	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	quizID: {
		type: String,
		ref: 'Quiz',
	},
	/** Time when the section was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Title of the section */
	title: {
		type: String,
	},
	/** Description of the section */
	description: {
		type: String,
	},
	/** Username of the creator of the section.
	 * 1. Must exist in the `users` document
	*/
	creator: {
		type: String,
		ref: 'User',
		// required: true,
	},
	/** Array of all the questions in the schema */
	questions: [questionSchema],
});

export default mongoose.model('Section', sectionSchema);
