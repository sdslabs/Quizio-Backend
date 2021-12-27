import request from 'supertest';
import app from '../../../src/app';
import { TEST_USERTOKEN } from '../../test.config';

describe('GET /api/v2/auth/login', () => {
	describe('should return unauthorized response when token is missing', () => {
		test('should respond with a 401 status code for unauthorized users', async () => {
			const response = await request(app).get('/api/v2/auth/login');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/auth/login');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});

		// issue : not able to pass data as req.user / req.token. only able to pass as req.body...
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/api/v2/auth/login')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.statusCode).toBe(200);
		});
		// check (user object and token) in data object of response
		// test('response type should be json, utf-8 encoded', async () => {
		// 	const response = await request(app).get('/api/v2/auth/login');
		// 	expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		// });
		// test('response type should be json, utf-8 encoded', async () => {
		// 	const response = await request(app).get('/api/v2/auth/login');
		// 	expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		// });
	});
});
// test('should respond with a 404 status code', async () => {
// 	const response = await request(app).post('/api/v2/auth/login');
// 	expect(response.statusCode).toBe(404);
// });
// test('should respond with a 404 status code', async () => {
// 	const response = await request(app).put('/api/v2/auth/login');
// 	expect(response.statusCode).toBe(404);
// });
// test('should respond with a 404 status code', async () => {
// 	const response = await request(app).delete('/api/v2/auth/login');
// 	expect(response.statusCode).toBe(404);
// });
// test('should respond with a 404 status code', async () => {
// 	const response = await request(app).trace('/api/v2/auth/login');
// 	expect(response.statusCode).toBe(404);
// });
// test('should respond with a 404 status code', async () => {
// 	const response = await request(app).patch('/api/v2/auth/login');
// 	expect(response.statusCode).toBe(404);
// });
