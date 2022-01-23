import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema;

const responseSchema = new Schema({

	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	time: {
		type: Date,
		required: true,
		default: Date.now,
	},
	quizId: {
		type: ObjectId,
		ref: 'Quizze',
	},
	username: {
		type: String,
		ref: 'User',
	},
	sectionId: {
		type: ObjectId,
		ref: 'Section',
	},
	questionId: {
		type: ObjectId,
		ref: 'Question',
	},
	body: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		default: 0,
	},
	history: [{
		evaluator: {
			type: String,
			ref: 'User',
		},
		score: {
			type: Number,
		},
	}],
});

export default mongoose.model('Response', responseSchema);
