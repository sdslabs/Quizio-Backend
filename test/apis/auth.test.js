import request from 'supertest';
import app from '../../src/app';
import { TEST_USERTOKEN, TEST_SUPERADMINTOKEN } from '../test.config';

describe('GET /api/v2/auth', () => {
	describe('should return a html file with info about auth', () => {
		test('should respond with a 200 status code', async () => {
			const response = await request(app).get('/api/v2/auth');
			expect(response.statusCode).toBe(200);
		});
		test('response type should be html', async () => {
			const response = await request(app).get('/api/v2/auth');
			expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth');
			expect(response.statusCode).toBe(404);
		});
	});
});

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

describe('GET /api/v2/auth/google', () => {
	describe('should redirect to Google Oauth and display accounts available for Oauth', () => {
		test('should respond with a 302 status code', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.statusCode).toBe(302);
		});
		test('response length should be 0', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.headers['content-length']).toBe('0');
		});
		test('should redirect to Google-Oauth (https://accounts.google.com/...)', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.redirect).toBe(true);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/google');
			expect(response.statusCode).toBe(404);
		});
	});
});

describe('GET /api/v2/auth/google/callback', () => {
	describe('should return with user data and null status code', () => {
		// const userData = {
		// 	sub: '100437770805185223285',
		// 	name: 'Sainath Rao',
		// 	given_name: 'Sainath',
		// 	family_name: 'Rao',
		// 	picture: 'https://lh3.googleusercontent.com/a-/AOh14Ghp8AVpn9xtV0VhqYZ6vkYOW3ohSTaleXWDzUHK-g=s96-c',
		// 	email: 'sainatharao@gmail.com',
		// 	email_verified: true,
		// 	locale: 'en'
		// }
		// const res = "";
		// // issue : not able to pass data as req.data . going as req.body....
		// test('should respond with a null status code+++++++++++++++', async () => {
		// 	const response = await request(app).get('/api/v2/auth/google/callback')
		// 		.send(userData,res)
		// 		// send data as req.user | not as req.user.userData
		// 	expect(!!response.statusCode).toBe(true);
		// });

		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/google/callback');
			expect(response.statusCode).toBe(404);
		});
	});
});

describe('GET /api/v2/auth/github', () => {
	describe('should redirect to GitHub Oauth and display accounts available for Oauth', () => {
		test('should respond with a 302 status code', async () => {
			const response = await request(app).get('/api/v2/auth/github');
			expect(response.statusCode).toBe(302);
		});
		test('response length should be 0', async () => {
			const response = await request(app).get('/api/v2/auth/github');
			expect(response.headers['content-length']).toBe('0');
		});
		test('should redirect to GitHub-Oauth (https://github.com/login/oauth/...)', async () => {
			const response = await request(app).get('/api/v2/auth/google');
			expect(response.redirect).toBe(true);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/github');
			expect(response.statusCode).toBe(404);
		});
	});
});

describe('GET /api/v2/auth/github/callback', () => {
	describe('should return with user data and null status code', () => {
		// check same for github oauth
		// const userData = {
		// 	sub: '100437770805185223285',
		// 	name: 'Sainath Rao',
		// 	given_name: 'Sainath',
		// 	family_name: 'Rao',
		// 	picture: 'https://lh3.googleusercontent.com/a-/AOh14Ghp8AVpn9xtV0VhqYZ6vkYOW3ohSTaleXWDzUHK-g=s96-c',
		// 	email: 'sainatharao@gmail.com',
		// 	email_verified: true,
		// 	locale: 'en'
		// }
		// const res = "";
		// // issue : not able to pass data as req.data . going as req.body....
		// test('should respond with a null status code+++++++++++++++', async () => {
		// 	const response = await request(app).get('/api/v2/auth/google/callback')
		// 		.send(userData,res)
		// 		// send data as req.user | not as req.user.userData
		// 	expect(!!response.statusCode).toBe(true);
		// });

		test('should respond with a 404 status code', async () => {
			const response = await request(app).post('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).put('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).delete('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).trace('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
		test('should respond with a 404 status code', async () => {
			const response = await request(app).patch('/api/v2/auth/github/callback');
			expect(response.statusCode).toBe(404);
		});
	});
});

describe('GET /api/v2/auth/login', () => {
	describe('should return unauthorized response when token is missing', () => {
		test('should respond with a 401 status code for unauthorized users', async () => {
			const response = await request(app).get('/api/v2/auth/login');
			expect(response.statusCode).toBe(401);
		});
		test('response type should be json, utf-8 encoded', async () => {
			const response = await request(app).get('/api/v2/auth/login');
			expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		});
	});
	// describe('should return valid response with status code 200 for authenticated users', () => {
	// issue : not able to pass data as req.user / req.token. only able to pass as req.body...
	// 	test('should respond with a 200 status code', async () => {
	// 		const response = await request(app).get('/api/v2/auth/login')
	// 			.set('Authorization', `Bearer ${TEST_USERTOKEN}`);
	// 		expect(response.statusCode).toBe(200);
	// 	});
	// 	// check (user object and token) in data object of response
	// 	test('response type should be json, utf-8 encoded', async () => {
	// 		const response = await request(app).get('/api/v2/auth/login');
	// 		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	// 	});
	// 	test('response type should be json, utf-8 encoded', async () => {
	// 		const response = await request(app).get('/api/v2/auth/login');
	// 		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	// 	});
	// });
	test('should respond with a 404 status code', async () => {
		const response = await request(app).post('/api/v2/auth/login');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).put('/api/v2/auth/login');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).delete('/api/v2/auth/login');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).trace('/api/v2/auth/login');
		expect(response.statusCode).toBe(404);
	});
	test('should respond with a 404 status code', async () => {
		const response = await request(app).patch('/api/v2/auth/login');
		expect(response.statusCode).toBe(404);
	});
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
	// describe('should return valid response with status code 200 for authenticated users', () => {
	// 	// issue : not able to pass data as req.user / req.token. only able to pass as req.body...
	// 	// test('should respond with a 200 status code', async () => {
	// 	// 	const req = {};
	// 	// 	const res = {};
	// 	// 	const response = await request(app).get('/api/v2/auth/logout')
	// 	// 		.set('Authorization', `Bearer ${TEST_USERTOKEN}`)
	// 	// 		.send(req, res);
	// 	// 	expect(response.statusCode).toBe(200);
	// 	// });
	// 	// // check non empty message of response
	// 	// test('response type should be json, utf-8 encoded', async () => {
	// 	// 	const response = await request(app).get('/api/v2/auth/logout');
	// 	// 	expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	// 	// });
	// 	// test('response type should be json, utf-8 encoded', async () => {
	// 	// 	const response = await request(app).get('/api/v2/auth/logout');
	// 	// 	expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	// 	// });
	// });
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