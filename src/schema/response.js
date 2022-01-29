import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Stores the responses of the quiz takers during the quiz */
const responseSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** Username of the user attempting the question */
	username: String,
	/** quizioID of the attempted question */
	questionID: String,
	/** Time when the question was last updated */
	time: {
		type: Date,
		default: Date.now,
	},
	/** Answer given by the user (mcq) */
	answerChoice: String,

	/** Answer given by the user (subjective) */
	answer: String,
});

export default mongoose.model('Response', responseSchema);
