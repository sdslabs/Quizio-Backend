import { failureResponseWithMessage, successResponseWithMessage } from '../helpers/responses';
import { verifyQuizioID, generateQuizioID } from '../helpers/utils';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';


const controller = {

	verifyQuizioID: async (req, res) => {
		const { id } = req.params;

		return verifyQuizioID(id)
			? successResponseWithMessage(res, 'ID is a valid quizio document ID, but is not guaranteed to be an actual ID in db')
			: failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	},
	
	uploadImage: async (req, res) => {
		const data = req;
		console.log(req.file);
		console.log(req.body);

		const form = new FormData();
		form.append('image', fs.createReadStream(req.file.path));
		form.append('name', generateQuizioID());
		form.append('key', '5f8bf99f5a3c8ddac572f7fb2f3835c4');
		
		console.log(form);
		const apiResponse = await axios.post('https://api.imgbb.com/1/upload',
			form,
			{
				headers: {
					'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
				}
			});
		console.log(apiResponse.data);
		return failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	}

};

export default controller;
