import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema to store list of people registered for quizzes */
const submitSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the quiz */
	quizID: {
		type: String,
		ref: 'Quiz',
	},
	/** username of the user */
	username: {
		type: String,
		ref: 'User',
	},
	/** Boolean stating if quiz is submitted or not */
	isSubmitted: {
		type: Boolean,
		default: false,
	},
    /** Current time */
    time: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Submit', submitSchema);
