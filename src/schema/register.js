import mongoose from 'mongoose';

const { Schema } = mongoose;

const registerSchema = new Schema({
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
