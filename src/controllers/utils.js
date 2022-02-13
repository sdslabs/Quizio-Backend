import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { failureResponseWithMessage, successResponseWithMessage, successResponseWithData } from '../helpers/responses';
import { verifyQuizioID, generateQuizioID } from '../helpers/utils';

const controller = {

	verifyQuizioID: async (req, res) => {
		const { id } = req.params;

		return verifyQuizioID(id)
			? successResponseWithMessage(res, 'ID is a valid quizio document ID, but is not guaranteed to be an actual ID in db')
			: failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	},

	uploadImage: async (req, res) => {
		const form = new FormData();
		form.append('image', fs.createReadStream(req.file.path));
		form.append('name', generateQuizioID());
		form.append('key', process.env.IMGBB_API_KEY);

		try {
			const apiResponse = await axios.post('https://api.imgbb.com/1/upload',
				form,
				{
					headers: {
						'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
					},
			});
			const fileRes = await fs.unlinkSync(req.file.path);
			if (fileRes) {
				console.log('File was not deleted. Recheck the upload image route');
			}
			return apiResponse.data.success ? successResponseWithData(res, { url: apiResponse.data.data.url }, 200) : failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
		} catch (e) {
			return failureResponseWithMessage(res, 'Error uploading image');
		}
	},

};

export default controller;
