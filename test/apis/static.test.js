import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app';

describe('GET /', () => {
	describe('should return a html file with info about quizio', () => {
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/');
			expect(response.statusCode).toBe(StatusCodes.OK);
		});
		test('response type should be html', async () => {
			const response = await request(app).get('/');
			expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');
		});
	});
});
