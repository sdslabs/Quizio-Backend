import { successResponseWithMessage, failureResponseWithMessage } from '../helpers/responses';
import submitUser from '../models/submit';

const controller = {
	submitUser: async (req, res) => {
		const submit = await submitUser(req.user.username, req.params.quizID);
		if (submit) successResponseWithMessage(res, 'Quiz submission successful');
		else failureResponseWithMessage(res, 'Quiz submission unsuccessful');
	},
};
export default controller;
