import { successResponseWithMessage, failureResponseWithMessage } from '../helpers/responses';
import { SubmitUser } from '../models/submit';

const controller = {
	SubmitUser: async (req, res) => {
		const submit = await SubmitUser( req.user['username'], req.params.quizID);
        if (submit) successResponseWithMessage(res, 'Quiz submission successful');
        else failureResponseWithMessage(res, 'Quiz submission unsuccessful');
	},  
};
export default controller;
