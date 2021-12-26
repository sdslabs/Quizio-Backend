import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app';

describe('GET /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).get('/404');
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('POST /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/404');
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).post('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('DELETE /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/404');
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).delete('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('PUT /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/404');
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).put('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('PATCH /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/404');
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).patch('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});
