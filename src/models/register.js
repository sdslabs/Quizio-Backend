import register from '../schema/register';

export const AddToQuiz = async (registerData) => {
	const exists = await register.find(registerData);
	if (exists.length === 0) {
		const newRegister = new register(registerData);
		const result = await newRegister.save();
		return result;
	}
	return 'User already registered!';
};

export const removeFromQuiz = async (registerData) => {
	const result = await register.findOneAndDelete(registerData);
	return result;
};

export const getRegisteredUsers = async (quizId) => {
	const users = await register.find({ quiz: quizId });
	const result = users.map((user) => user.username);
	return result;
};
