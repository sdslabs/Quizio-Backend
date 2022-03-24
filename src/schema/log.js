import mongoose from 'mongoose';
import { logConfig } from '../config/config';

const { Schema } = mongoose;

const logSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	quizID: String,
	userID: String,
	logType: String,
	logData: String,
	frequency: {
		type: Number,
		default: 1,
	},
	time: {
		type: Date,
		default: Date.now,
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
