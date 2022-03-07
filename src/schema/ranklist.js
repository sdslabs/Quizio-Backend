import mongoose from 'mongoose';

const { Schema } = mongoose;

const ranklistSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the quiz */
	quizID: String,
	/** quizioID of the person who generated the ranklist */
	generatedBy: String,
	/** Ranklist */
	rankList: [{
		quizScore: String,
		registrantID: String,
	}],
	/** Time when the question was last updated */
	time: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Ranklist', ranklistSchema);
