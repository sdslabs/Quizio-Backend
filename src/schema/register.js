import mongoose from 'mongoose';

const { Schema } = mongoose;

const registerSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	quizId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Quiz',
	},
	username: {
		type: String,
		ref: 'User',
	},
});

export default mongoose.model('Register', registerSchema);
