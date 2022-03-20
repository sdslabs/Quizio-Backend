import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Stores the responses of the quiz takers during the quiz */
const responseSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the user attempting the question */
	userID: String,
	/** quizioID of the attempted question */
	questionID: String,
	/** Time when the question was last updated */
	time: {
		type: Date,
		default: Date.now,
	},
	/** Answer(s) given by the user (mcq) */
	answerChoices: [String],
	/** Answer given by the user (subjective) */
	answer: String,
	/** Can be not-answered, marked, answered, marked-answered */
	status: {
		type: String,
		enum: ['unanswered', 'answered', 'marked-answered', 'marked'],
		default: 'answered',
	},
});

export default mongoose.model('Response', responseSchema);
