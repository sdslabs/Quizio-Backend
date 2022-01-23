import mongoose from 'mongoose';
import questionSchema from './question';

const { Schema } = mongoose;

const sectionSchema = new Schema({

	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
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
	/** Array of all the questions in the schema */
	questions: [questionSchema],
});

export default sectionSchema;
