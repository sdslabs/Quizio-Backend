import mongoose from 'mongoose';
import { logConfig } from '../config/config';

const { Schema } = mongoose;

const logSchema = new Schema({
	quizId: {
		// TODO: use another id
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Quiz',
	},
	username: {
		// TODO: use username
		type: String,
		ref: 'User',
	},
	logType: {
		type: String,
		required: true,
	},
	frequency: {
		type: Number,
		default: 1,
	},
},
{
	capped: {
		capped: true,
		size: logConfig.maxCappedSize,
		max: logConfig.maxCappedValue,
		autoIndexId: true,
	},
});
export default mongoose.model('Log', logSchema);
