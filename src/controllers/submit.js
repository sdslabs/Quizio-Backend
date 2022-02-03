import { successResponseWithData, failureResponseWithMessage } from '../helpers/responses';
import submitUser from '../models/submit';

const controller = {
	submitUser: async (req, res) => {
		const { quizID } = req.params;
		const { username } = req.user;
		const submit = await submitUser(username, quizID);
		if (submit) successResponseWithData(res, { submit });
		else failureResponseWithMessage(res, 'Quiz submission unsuccessful');
	},
};
export default controller;
