import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoreSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the quiz */
	quizId: String,
	/** username of the checker */
	checkBy: String,
	/** ranklist for this quiz */
	rankList: [{
		username: String,
		marks: Number,
	}],
});

export default mongoose.model('Score', scoreSchema);
