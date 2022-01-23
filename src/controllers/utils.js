import { failureResponseWithMessage, successResponseWithMessage } from '../helpers/responses';

const controller = {

	verifyQuizioID: async (req, res) => {
		const { id } = req.params;

		if (id.length === 30 && id.includes('.') && id.split('.')[0] === 'quizioID') {
			return successResponseWithMessage(res, 'ID is a valid quizio document ID, but is not guaranteed to be an actual ID in db');
		}

		return failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	},

};

export default controller;
