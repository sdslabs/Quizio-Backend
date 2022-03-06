import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoreSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the question */
	questionId: String,
	/** quizioID of the checker */
	checkBy: String,
	/** true it was autochecked */
	autochecked: Boolean,
	/** assigned marks for the question */
	marks: Number,
});

export default mongoose.model('Score', scoreSchema);
