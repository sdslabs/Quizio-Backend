import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';

import { TEST_MONGOURI } from '../test.config';

beforeAll(async () => {
	await mongoose.connect(TEST_MONGOURI);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('GET /api/v2/register/quizzes/:quizId', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).get('/api/v2/register/quizzes/123');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/register/quizzes/123');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	test('response type should be json, utf-8 encoded', async () => {
		const response = await request(app).get('/api/v2/register/quizzes/123');
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).post('/api/v2/register/quizzes/123');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).put('/api/v2/register/quizzes/123');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).delete('/api/v2/register/quizzes/123');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/register/quizzes/123');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/register/quizzes/123');
		expect(response.statusCode).toBe(404);
	});
});

describe('POST /api/v2/register/quizzes', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).post('/api/v2/register/quizzes/123/diya');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).post('/api/v2/register/quizzes');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	test('response type should be json, utf-8 encoded', async () => {
		const response = await request(app).post('/api/v2/register/quizzes');
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).get('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).put('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});// why is this failing
	test('should respond with a 404 status code', async () => {
		const response = await request(app).delete('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
});

describe('DELETE /api/v2/register/quizzes/:quizId', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).delete('/api/v2/register/quizzes');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).delete('/api/v2/register/quizzes');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});

	test('response type should be json, utf-8 encoded', async () => {
		const response = await request(app).delete('/api/v2/register/quizzes');
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).post('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).put('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).get('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/register/quizzes');
		expect(response.statusCode).toBe(404);
	});
});
