import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

import { superAdminToken, MONGOURI } from './test.config';

beforeAll(async () => {
	console.log({ superAdminToken, MONGOURI });
	await mongoose.connect('mongodb+srv://Rebel:nJOKBHY9OX14aPnN@quizio.eoo73.mongodb.net/test');
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('GET /api/v2/users', () => {
	describe('should return unauthenticatedResponse when token is missing', () => {
		test('should respond with a 401 status code for unauthenticated users', async () => {
			const response = await request(app).get('/api/v2/users');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/users');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});

	describe('should return unauthorizedResponse when the user making the request is not superAdmin', () => {
		test('should respond with a 403 status code for unauthorized users', async () => {
			const response = await request(app).get('/api/v2/users')
				.set('Authorization', `Bearer ${'eyJhbGciOiJIUzI1NiJ9.Y29kZS5jYXByaWNpb3VzcmViZWxAZ21haWwuY29t.CqytMhhoMPEy6EBHDZ_2cI3Ci2QDVs6ufzwTfWGMvM8'}`);
			expect(response.statusCode).toBe(200);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/users');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});
