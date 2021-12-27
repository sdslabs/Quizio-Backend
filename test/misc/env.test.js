import dotenv from 'dotenv';

dotenv.config();

const { MONGOURI } = process.env;
const { JWTKEY } = process.env;

const { GOOGLECLIENTID } = process.env;
const { GOOGLECLIENTSECRET } = process.env;
const { GOOGLECALLBACKURL } = process.env;

const { GITHUBCLIENTID } = process.env;
const { GITHUBCLIENTSECRET } = process.env;
const { GITHUBCALLBACKURL } = process.env;

const { TEST_SUPERADMINTOKEN } = process.env;
const { TEST_USERTOKEN } = process.env;
const { TEST_MONGOURI } = process.env;

describe('Google env variables', () => {
	test('GOOGLECLIENTID', async () => {
		expect(!!GOOGLECLIENTID).toBe(true);
	});
	test('GOOGLECLIENTSECRET', async () => {
		expect(!!GOOGLECLIENTSECRET).toBe(true);
	});
	test('GOOGLECALLBACKURL', async () => {
		expect(!!GOOGLECALLBACKURL).toBe(true);
	});
});

describe('GitHub env variables', () => {
	test('GITHUBCLIENTID', async () => {
		expect(!!GITHUBCLIENTID).toBe(true);
	});
	test('GITHUBCLIENTSECRET', async () => {
		expect(!!GITHUBCLIENTSECRET).toBe(true);
	});
	test('GITHUBCALLBACKURL', async () => {
		expect(!!GITHUBCALLBACKURL).toBe(true);
	});
});

describe('Test env variables', () => {
	test('TEST_SUPERADMINTOKEN', async () => {
		expect(!!TEST_SUPERADMINTOKEN).toBe(true);
	});
	test('TEST_USERTOKEN', async () => {
		expect(!!TEST_USERTOKEN).toBe(true);
	});
	test('TEST_MONGOURI', async () => {
		expect(!!TEST_MONGOURI).toBe(true);
	});
});

describe('Misc env variables', () => {
	test('MONGOURI', async () => {
		expect(!!MONGOURI).toBe(true);
	});
	test('JWTKEY', async () => {
		expect(!!JWTKEY).toBe(true);
	});
});
