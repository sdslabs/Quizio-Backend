import request from 'supertest';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import app from '../../../src/app';
import { TEST_MONGOURI, TEST_USERTOKEN } from '../../test.config';

beforeAll(async () => {
	await mongoose.connect(TEST_MONGOURI);
});

afterAll(async () => {
	// await mongoose.connection.close();
	await mongoose.disconnect();
});

describe('GET /api/v2/quizzes', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).get('/api/v2/quizzes');
			expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/quizzes');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	describe('should return successResponse when the user making the request is authenticated', () => {
		test('should respond with a 200 status code for authorized users', async () => {
			const response = await request(app).get('/api/v2/quizzes')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.statusCode).toBe(StatusCodes.OK);
		});
	});
});
