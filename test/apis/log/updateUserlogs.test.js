import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

import { TEST_SUPERADMINTOKEN, TEST_MONGOURI, TEST_USERTOKEN } from '../../test.config';

beforeAll(async () => {
	await mongoose.connect(TEST_MONGOURI);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('PUT /api/v2/logs/diya', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).put('/api/v2/logs/diya');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).put('/api/v2/logs/diya');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});

	describe('should return unauthorizedResponse when the user making the request is not superAdmin', () => {
		test('should respond with a 403 status code for unauthorized users', async () => {
			const response = await request(app).put('/api/v2/logs/diya')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.statusCode).toBe(403);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).put('/api/v2/logs/diya');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});

	describe('should return successResponse when the user making the request is superAdmin', () => {
		/*  TODO: @diya
		test('should respond with a 200 status code and some data for superAdmin', async () => {
			/// Add a valid body to this test
			const response = await request(app).put('/api/v2/logs/code.capriciousrebel@gmail.com')
				.set('Authorization', `Bearer ${TEST_SUPERADMINTOKEN}`);
			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty('success');
			expect(response.body.success).toBe(1);
			expect(response.body).toHaveProperty('data');
			expect(response.body.data).toHaveProperty('logs');

		}); */
		test('should respond with a 400 status code and some data for superAdmin when body is invalid', async () => {
			const response = await request(app).put('/api/v2/logs/code.capriciousrebel@gmail.com')
				.set('Authorization', `Bearer ${TEST_SUPERADMINTOKEN}`);
			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('message');
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).put('/api/v2/logs/diya');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).post('/api/v2/logs/diya');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).delete('/api/v2/logs/diya');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/logs/diya');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/logs/diya');
		expect(response.statusCode).toBe(404);
	});
});
