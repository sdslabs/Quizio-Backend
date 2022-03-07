import mongoose from 'mongoose';

const { Schema } = mongoose;

/** Schema to store list of people registered for quizzes */
const registerSchema = new Schema({
	/** Unique id for every document in quizio database, generated using nanoid */
	quizioID: String,
	/** quizioID of the quiz */
	quizID: String,
	/** quizioID of the user */
	userID: String,
	/* First Name of the registrant */
	firstName: String,
	/* Last Name of the registrant */
	lastName: String,
	/* Email of the registrant */
	email: String,
	/* Contact Number of the registrant */
	contactNo: String,
	/* Organisation Name of the registrant */
	orgName: String,
	/* Additional details for the quiz */
	detail1: {
		key: String,
		value: String,
	},
	/* Additional details for the quiz */
	detail2: {
		key: String,
		value: String,
	},
	/* Additional details for the quiz */
	detail3: {
		key: String,
		value: String,
	},
	/** Time when the question was last updated */
	time: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Register', registerSchema);
