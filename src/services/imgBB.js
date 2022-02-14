import axios from 'axios';
import { IMGBB_UPLOAD_URL } from '../config/config';

const uploadToImgBB = async (form, headers) => axios.post(
	IMGBB_UPLOAD_URL,
	form,
	{ headers },
);
export default uploadToImgBB;
