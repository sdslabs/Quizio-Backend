import { failureResponseWithMessage, successResponseWithMessage } from '../helpers/responses';
import { verifyQuizioID } from '../helpers/utils';

const controller = {

	verifyQuizioID: async (req, res) => {
		const { id } = req.params;

		return verifyQuizioID(id)
			? successResponseWithMessage(res, 'ID is a valid quizio document ID, but is not guaranteed to be an actual ID in db')
			: failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	},

};

export default controller;
