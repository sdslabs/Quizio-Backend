import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema for each section */
const sectionSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the parent question */
	quizID: String,
	/** Time when the section was created */
	createdOn: {
		type: Date,
		default: Date.now,
	},
	/** Title of the section */
	title: String,
	/** Description of the section */
	description: String,
	/** UserID of the creator of the section. */
	creator: String,
	/** quizioIDs of the questions in the section */
	questions: [String],
});

export default mongoose.model('Section', sectionSchema);
