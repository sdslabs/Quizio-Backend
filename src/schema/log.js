import mongoose from 'mongoose';

const { Schema } = mongoose;

const logSchema = new Schema({
	quizId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Quiz',
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	logtype: {
		type: String,
		required: true,
	},
	frequency: {
		type: Number,
		default: 1,
	},
});
// {
// 	capped: {
// 		size: config.maxCappedSize,
// 		max: config.maxCappedValue,
// 	},

export default mongoose.model('Log', logSchema);
