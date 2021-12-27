import request from 'supertest';
import app from '../../../src/app';

describe('GET /api/v2/auth/github/callback', () => {
	describe('should return with user data and null status code', () => {
		// check same for github oauth
		// const userData = {
		// 	sub: '100437770805185223285',
		// 	name: 'Sainath Rao',
		// 	given_name: 'Sainath',
		// 	family_name: 'Rao',
		// 	picture: 'https://lh3.googleusercontent.com/a-/AOh14Ghp8AVpn9xtV0VhqYZ6vkYOW3ohSTaleXWDzUHK-g=s96-c',
		// 	email: 'sainatharao@gmail.com',
		// 	email_verified: true,
		// 	locale: 'en'
		// }
		// const res = "";
		// // issue : not able to pass data as req.data . going as req.body....
		// test('should respond with a null status code+++++++++++++++', async () => {
		// 	const response = await request(app).get('/api/v2/auth/google/callback')
		// 		.send(userData,res)
		// 		// send data as req.user | not as req.user.userData
		// 	expect(!!response.statusCode).toBe(true);
		// });

		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
	});
});
