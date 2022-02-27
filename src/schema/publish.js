import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Stores the responses of the quiz takers during the quiz */
const publishSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** UserID of the user attempting the question */
	publishedBy: String,
	/** quizioID of the attempted question */
	quizID: String,
	/** Time when the question was last updated */
	time: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Publish', publishSchema);
