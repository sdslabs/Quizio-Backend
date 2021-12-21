import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
	describe('should return a html file with info about quizio', () => {
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/');
			expect(response.statusCode).toBe(200);
		});
		test('response type should be html', async () => {
			const response = await request(app).get('/');
			expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');
		});
	});
});

describe('GET /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).get('/404');
			expect(response.statusCode).toBe(404);
		});
		test('response type should be html', async () => {
			const response = await request(app).get('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('POST /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/404');
			expect(response.statusCode).toBe(404);
		});
		test('response type should be html', async () => {
			const response = await request(app).post('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('DELETE /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/404');
			expect(response.statusCode).toBe(404);
		});
		test('response type should be html', async () => {
			const response = await request(app).delete('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('PUT /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/404');
			expect(response.statusCode).toBe(404);
		});
		test('response type should be html', async () => {
			const response = await request(app).put('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});

describe('PATCH /404', () => {
	describe('should return a 404 response', () => {
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/404');
			expect(response.statusCode).toBe(404);
		});
		test('response type should be html', async () => {
			const response = await request(app).patch('/404');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
});
