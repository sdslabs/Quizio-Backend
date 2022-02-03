import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema to store list of people registered for quizzes */
const submitSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the quiz */
	quizID: String,
	/** username of the user */
	username: String,
	/** Current time */
	time: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Submit', submitSchema);
