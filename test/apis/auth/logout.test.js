import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';
import { TEST_MONGOURI, TEST_USERTOKEN } from '../../test.config';

beforeAll(async () => {
	await mongoose.connect(TEST_MONGOURI);
});

afterAll(async () => {
	// await mongoose.connection.close();
	await mongoose.disconnect();
});

describe('GET /api/v2/auth/logout', () => {
	describe('should return unauthorized response when token is missing', () => {
		test('should respond with a 401 status code for unauthorized users', async () => {
			const response = await request(app).get('/api/v2/auth/logout');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/auth/logout');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	describe('should return valid response with status code 200 for authenticated users', () => {			
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/api/v2/auth/logout')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.statusCode).toBe(200);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/auth/logout')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/auth/logout')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.body).toHaveProperty('success');
			expect(response.body.success).toBe(1);
			expect(response.body).toHaveProperty('message');
			expect(response.body.message).toHaveProperty('message');
		});
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).post('/api/v2/auth/logout');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).put('/api/v2/auth/logout');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).delete('/api/v2/auth/logout');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/auth/logout');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/auth/logout');
		expect(response.statusCode).toBe(404);
	});
});
