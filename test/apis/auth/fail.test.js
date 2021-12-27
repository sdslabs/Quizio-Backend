import request from 'supertest';
import app from '../../../src/app';

describe('GET /api/v2/auth/fail', () => {
	describe('should return with a html file with login failed error message', () => {
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/api/v2/auth/fail');
			expect(response.statusCode).toBe(200);
		});
		test('response type should be html', async () => {
			const response = await request(app).get('/api/v2/auth/fail');
			expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/fail');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/fail');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/fail');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/fail');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/fail');
			expect(response.statusCode).toBe(404);
		});
	});
});
