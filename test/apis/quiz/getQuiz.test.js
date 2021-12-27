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

describe('GET /api/v2/quizzes/:quizId', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).get('/api/v2/quizzes/617f17edeb203da3fb579d86');
			expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
		});
	});
	describe('should return sucessResponse when user making the request is authenticated', () => {
		test('should respond with 200 status code for authorized users', async () => {
			const response = await request(app).get('/api/v2/quizzes/617f17edeb203da3fb579d86')
				.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
			expect(response.statusCode).toBe(StatusCodes.OK);
		});
	});
});
