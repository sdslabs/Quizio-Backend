import { nanoid } from 'nanoid';

export const verifyQuizioID = (id) => (id.length === 30 && id.includes('.') && id.split('.')[0] === 'quizioID');
export const generateQuizioID = () => `quizioID.${nanoid()}`;
