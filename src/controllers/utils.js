import fs from 'fs';
import FormData from 'form-data';
import dayjs from 'dayjs';
import {
	failureResponseWithMessage, successResponseWithMessage, successResponseWithData, errorsResponse,
} from '../helpers/responses';
import { verifyQuizioID, generateQuizioID } from '../helpers/utils';
import { IMGBB_API_KEY } from '../config/config';
import logger from '../helpers/logger';
import uploadToImgBB from '../services/imgBB';

const controller = {

	verifyQuizioID: async (req, res) => {
		const { id } = req.params;

		return verifyQuizioID(id)
			? successResponseWithMessage(res, 'ID is a valid quizio document ID, but is not guaranteed to be an actual ID in db')
			: failureResponseWithMessage(res, 'ID is NOT a valid quizio document ID, the format is `quizioID.{nanoid())}`');
	},

	uploadImage: async (req, res) => {
		try {
			const name = generateQuizioID();
			const { path } = req.file;

			const form = new FormData();
			const image = fs.createReadStream(path);

			const headers = {
				'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
			};

			form.append('name', name);
			form.append('image', image);
			form.append('key', IMGBB_API_KEY);

			fs.unlink(path, (err) => {
				if (err) {
					logger.error('Uploaded File was NOT Deleted');
					logger.info('Path', path);
					fs.readdir('uploads/', (error, files) => {
						if (error) {
							logger.error('Failed to get total number of junk files on server :(');
						}
						logger.info(`Total number of junk files on server: ${files.length}`);
					});
				}
			});

			const uploadRes = await uploadToImgBB(form, headers);
			return uploadRes.data.success
				? successResponseWithData(res, { url: uploadRes.data.data.url })
				: failureResponseWithMessage(res, 'Couldnt upload image (service error)');
		} catch (e) {
			return errorsResponse(res, ['Couldnt upload image (quizio error)', e]);
		}
	},

	getCurrentTime: (req, res) => successResponseWithData(res, { serverTime: dayjs().toISOString() }),

};

export default controller;
